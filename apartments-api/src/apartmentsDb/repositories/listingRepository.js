'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');
const helper = require('./repositoryHelper');
const apartmentRepository = require('./apartmentRepository');
const buildingRepository = require('./buildingRepository');
const cityRepository = require('./cityRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

const listingAttributes = { exclude: ['updated_at'] };
const apartmentAttributes = { exclude: ['created_at', 'updated_at'] };
const buildingAttributes = { exclude: ['created_at', 'updated_at'] };
const cityAttributes = ['id', 'city_name'];
const neighborhoodAttributes = ['id', 'neighborhood_name', 'city_id'];
const imageAttributes = { exclude: ['created_at', 'updated_at'] };

const LISTING_UPDATE_WHITELIST = ['status', 'monthly_rent', 'roommates', 'property_tax', 'board_fee', 'lease_start',
  'lease_end', 'publishing_user_type', 'roommate_needed', 'directions', 'description', 'show_phone', 'show_for_future_booking', 'property_value', 'rent_lead_by'];
const APARTMENT_UPDATE_WHITELIST = ['apt_number', 'size', 'rooms', 'floor', 'parking', 'sun_heated_boiler', 'pets',
  'air_conditioning', 'balcony', 'security_bars', 'parquet_floor'];
const BUILDING_UPDATE_WHITELIST = ['floors', 'elevator', 'entrance'];

const fullListingDataInclude = [
  {
    model: models.apartment,
    attributes: apartmentAttributes,
    required: true,
    include: [{
      model: models.building,
      attributes: buildingAttributes,
      required: true,
      include: [{
        model: models.city,
        attributes: cityAttributes,
        required: true
      }, {
        model: models.neighborhood,
        attributes: neighborhoodAttributes,
        required: true
      }]
    }]
  },
  {
    model: models.image,
    attributes: imageAttributes
  }
];

function list(query, options = {}) {
  const modelName = options.oldListings ? 'listing' : 'latest_listing';

  return models[modelName].findAll({
    attributes: options.listingAttributes || ['id', 'slug', 'title', 'monthly_rent', 'roommate_needed', 'lease_start', 'lease_end', 'status', 'created_at', 'apartment_id'],
    where: query,
    include: [
      {
        model: models.apartment,
        attributes: ['size', 'rooms', 'apt_number'],
        required: true,
        where: options.apartmentQuery || {},
        include: [
          {
            model: models.building,
            attributes: ['street_name', 'house_number'],
            required: true,
            where: options.buildingQuery || {},
            include: [
              {
                model: models.city,
                attributes: ['id', 'city_name'],
                required: true
              },
              {
                model: models.neighborhood,
                attributes: ['id', 'neighborhood_name'],
                required: true,
                where: options.neighborhoodQuery || {}
              }
            ]
          },
          {
            model: models.like,
            attributes: [],
            required: !!options.likeQuery,
            where: options.likeQuery
          }
        ]
      },
      {
        model: models.image,
        attributes: ['listing_id', 'url', 'display_order'],
        order: 'display_order ASC',
        limit: 1,
      }
    ],

    limit: options.limit,
    offset: options.offset,
    order: options.order ? modelName + '.' + options.order : undefined // workaround to prevent ambiguous field on order by
  });
}

function getOneListing(where) {
  return models.listing.findOne({
    attributes: listingAttributes,
    where,
    include: fullListingDataInclude
  });
}

function getLatestListingByApartmentId(apartmentId) {
  return models.latest_listing.findOne({
    attributes: listingAttributes,
    where: {
      apartment_id: apartmentId,
      status: { $notIn: ['deleted'] }
    },
    include: fullListingDataInclude
  });
}

async function create(listing) {
  const city = await cityRepository.findOrCreate(listing.apartment.building.city);
  listing.apartment.building.city_id = city.id;

  const building = await buildingRepository.updateOrCreate(listing.apartment.building);
  building.city = city;

  const apartment = await apartmentRepository.updateOrCreate(
    listing.apartment.apt_number,
    building.id,
    listing.apartment
  );

  apartment.building = building;

  let newListing = models.listing.build(_.pick(listing, helper.getModelFieldNames(models.listing)));
  newListing.apartment_id = apartment.id;
  let savedListing = await newListing.save();

  savedListing.apartment = apartment;

  if (listing.images) {
    savedListing.images = await Promise.all(listing.images.map(image => {
      image.listing_id = savedListing.id;
      return models.image.create(image);
    }));
  }

  return savedListing;
}

function getSlugs(ids) {
  return models.listing.findAll({
    attributes: ['id', 'slug'],
    where: { id: ids },
    raw: true
  });
}

async function update(listing, patch) {
  logger.debug('updating listing');
  const transaction = await db.db.transaction();
  try {
    const buildingRequest = _.get(patch, 'apartment.building');
    const buildingPatch = _.pick(buildingRequest || {}, BUILDING_UPDATE_WHITELIST);
    const apartmentPatch = _.pick(patch.apartment || {}, APARTMENT_UPDATE_WHITELIST);
    const listingPatch = _.pick(patch, LISTING_UPDATE_WHITELIST);

    const currentBuilding = listing.apartment.building;
    let newBuilding;

    // if main building properties change - we move apartment+listing to a different building
    if (buildingRequest) {
      let mergedBuilding = _.merge({}, currentBuilding.toJSON(), buildingRequest);
      mergedBuilding = _.omit(mergedBuilding, ['geolocation']);
      newBuilding = await buildingRepository.updateOrCreate(mergedBuilding, { transaction });
      logger.trace('found other building', { oldBuildingId: currentBuilding.id, newBuildingId: newBuilding.id });
      apartmentPatch.building_id = newBuilding.id;
    }

    if (!_.isEmpty(buildingPatch)) {
      logger.trace('updating building', { listing_id: listing.id });
      await (newBuilding || currentBuilding).update(buildingPatch, { transaction });
    }

    if (!_.isEmpty(apartmentPatch)) {
      logger.trace('updating apartment', { listing_id: listing.id });
      await listing.apartment.update(apartmentPatch, { transaction });
    }

    if (!_.isEmpty(listingPatch)) {
      logger.trace('updating listing', { listing_id: listing.id });
      await listing.update(listingPatch, { transaction });
    }

    if (patch.images) {
      logger.trace('removing deleted images');
      await Promise.all(listing.images.filter(existingImage => {
        const inPatch = _.find(patch.images, { url: existingImage.url });
        return !inPatch;
      }).map(imageToDelete => imageToDelete.destroy({ transaction })));

      logger.trace('creating / updating patched images');
      await Promise.all(patch.images.map((imageFromPatch) => {
        const imageExists = _.find(listing.images, { url: imageFromPatch.url });
        if (imageExists) {
          imageExists.display_order = imageFromPatch.display_order;
          return imageExists.save({ transaction });
        } else {
          imageFromPatch.listing_id = listing.id;
          return models.image.create(imageFromPatch, { transaction });
        }
      }));
    }

    logger.trace('updating ready to commit', { listing_id: listing.id });
    await transaction.commit();
    return await listing.reload();
  } catch (ex) {
    await transaction.rollback();
    throw ex;
  }
}

async function getMonthlyReportData(reportDate, leaseStartDays) {
  const sequelize = models.listing.sequelize;
  const res = await models.listing.findAll({
    attributes: [
      'id',
      'publishing_user_id'
    ],
    where: {
      status: 'rented',
      publishing_user_type: 'landlord',
      lease_end: { $gt: reportDate },
      $and: [
        sequelize.where(sequelize.fn('day', sequelize.col('listing.lease_start')), { $in: leaseStartDays })
      ]
    }
  });

  return res;
}

module.exports = {
  list,
  create,
  getById: id => getOneListing({ id }),
  getBySlug: slug => getOneListing({ slug }),
  getByApartmentId: getLatestListingByApartmentId,
  getSlugs,
  update,
  getMonthlyReportData,
  listingStatuses: models.listing.attributes.status.values
};
