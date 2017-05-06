'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');
const helper = require('./repositoryHelper');
const apartmentRepository = require('./apartmentRepository');
const buildingRepository = require('./buildingRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const geoProvider = require('../../providers/geoProvider');

const listingAttributes = { exclude: [ 'updated_at' ] };
const apartmentAttributes = { exclude: [ 'created_at', 'updated_at' ] };
const buildingAttributes = { exclude: [ 'created_at', 'updated_at' ] };
const cityAttributes = [ 'id', 'city_name' ];
const neighborhoodAttributes = [ 'id', 'neighborhood_name', 'city_id' ];
const imageAttributes = { exclude: [ 'created_at', 'updated_at' ] };

const LISTING_UPDATE_WHITELIST = [ 'status', 'monthly_rent', 'roommates', 'property_tax', 'board_fee', 'lease_start',
  'lease_end', 'publishing_user_type', 'roommate_needed', 'directions', 'description', 'is_phone_visible' ];
const APARTMENT_UPDATE_WHITELIST = [ 'apt_number', 'size', 'rooms', 'floor', 'parking', 'sun_heated_boiler', 'pets',
  'air_conditioning', 'balcony', 'security_bars', 'parquest_floor' ];
const BUILDING_UPDATE_WHITELIST = [ 'floors', 'elevator', 'entrance' ];

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
  return models.listing.findAll({
    attributes: ['id', 'slug', 'title', 'monthly_rent', 'roommate_needed', 'lease_start', 'status', 'created_at'],
    where: query,
    include: [
      {
        model: models.apartment,
        attributes: ['size', 'rooms'],
        required: true,
        where: options.apartmentQuery || {},
        include: {
          model: models.building,
          attributes: ['street_name'],
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
              attributes: ['neighborhood_name'],
              required: true
            }
          ]
        }
      },
      {
        model: models.image,
        attributes: ['listing_id', 'url', 'display_order'],
        order: 'display_order ASC',
        limit: 1,
      },
      {
        model: models.like,
        attributes: [],
        required: !!options.likeQuery,
        where: options.likeQuery,
      }
    ],

    limit: options.limit,
    offset: options.offset,
    order: options.order ? 'listing.' + options.order : undefined // workaround to prevent ambiguous field on order by
  });
}

function getOneListing(where) {
  return models.listing.findOne({
    attributes: listingAttributes,
    where,
    include: fullListingDataInclude
  });
}

function* create(listing) {
  const building = yield buildingRepository.findOrCreate(listing.apartment.building);

  const apartment = yield apartmentRepository.findOrCreate(
    listing.apartment.apt_number,
    building.id,
    listing.apartment
  );

  let newListing = models.listing.build(_.pick(listing, helper.getModelFieldNames(models.listing)));
  newListing.apartment_id = apartment.id;
  let savedListing = yield newListing.save();

  apartment.building = building;
  savedListing.apartment = apartment;

  if (listing.images) {
    savedListing.images = yield listing.images.map(image => {
      image.listing_id = savedListing.id;
      return models.image.create(image);
    });
  }

  return savedListing;
}

function getListingsForApartment(apartment, listingQuery) {
  const includeCity = {
    model: models.city,
    attributes: cityAttributes,
    required: true,
    where: {
      id: apartment.building.city.city_id
    }
  };

  const includeNeighborhood = {
    model: models.neighborhood,
    attributes: neighborhoodAttributes,
    required: true,
    where: {
      id: apartment.building.neighborhood.neighborhood_id
    }
  };

  const includeBuildings = [{
    model: models.building,
    attributes: buildingAttributes,
    required: true,
    where: {
      street_name: apartment.building.street_name,
      house_number: apartment.building.house_number
    },
    include: [includeCity, includeNeighborhood]
  }];

  const includeApartment = [{
    model: models.apartment,
    attributes: apartmentAttributes,
    required: true,
    where: {
      apt_number: apartment.apt_number
    },
    include: includeBuildings
  }];

  return models.listing.findAll({
    attributes: listingAttributes,
    where: listingQuery,
    include: includeApartment,
    raw: true
  });
}

function getSlugs(ids) {
  return models.listing.findAll({
    attributes: [ 'id', 'slug' ],
    where: { id: ids },
    raw: true
  });
}

function * update(listing, patch) {
  logger.debug('updating listing');
  const transaction = yield db.db.transaction();
  try {
    const buildingRequest = _.get(patch, 'apartment.building');
    const buildingPatch = _.pick(buildingRequest || {}, BUILDING_UPDATE_WHITELIST);
    const apartmentPatch = _.pick(patch.apartment || {}, APARTMENT_UPDATE_WHITELIST);
    const listingPatch = _.pick(patch, LISTING_UPDATE_WHITELIST);

    const currentBuilding = listing.apartment.building;
    let newBuilding;

    // if main building properties change - we move apartment+listing to a different building
    if (buildingRequest && currentBuilding.isDifferentBuilding(buildingRequest)) {
      logger.trace('update to different building', { listing_id: listing.id });
      let mergedBuilding = _.merge({}, currentBuilding.toJSON(), buildingRequest);
      mergedBuilding = _.omit(mergedBuilding, ['geolocation']);
      newBuilding = yield buildingRepository.findOrCreate(mergedBuilding, { transaction });
      logger.trace('found other building', { oldBuildingId: currentBuilding.id, newBuildingId: newBuilding.id });
      apartmentPatch.building_id = newBuilding.id;
      if (!newBuilding.geolocation) {
        buildingPatch.geolocation = yield geoProvider.getGeoLocation(newBuilding);
      }
    }

    if (!_.isEmpty(buildingPatch)) {
      logger.trace('updating building', { listing_id: listing.id });
      yield (newBuilding || currentBuilding).update(buildingPatch, { transaction });
    }

    if (!_.isEmpty(apartmentPatch)) {
      logger.trace('updating apartment', { listing_id: listing.id });
      yield listing.apartment.update(apartmentPatch, { transaction });
    }

    if (!_.isEmpty(listingPatch)) {
      logger.trace('updating listing', { listing_id: listing.id });
      yield listing.update(listingPatch, { transaction });
    }

    if (patch.images) {
      logger.trace('removing deleted images');
      yield listing.images.filter(existingImage => {
        const inPatch = _.find(patch.images, { url: existingImage.url });
        return !inPatch;
      }).map(imageToDelete => imageToDelete.destroy({ transaction }));

      logger.trace('creating / updating patched images');
      yield patch.images.map((imageFromPatch, index) => {
        const imageExists = _.find(listing.images, { url: imageFromPatch.url });
        if (imageExists) {
          imageExists.display_order = index;
          return imageExists.save({ transaction });
        } else {
          imageFromPatch.listing_id = listing.id;
          imageFromPatch.display_order = index;
          return models.image.create(imageFromPatch, { transaction });
        }
      });
    }

    logger.trace('updating ready to commit', { listing_id: listing.id });
    yield transaction.commit();
    return yield listing.reload();
  } catch(ex) {
    yield transaction.rollback();
    throw ex;
  }
}

module.exports = {
  list,
  create,
  getListingsForApartment,
  getById: id => getOneListing({ id }),
  getBySlug: slug => getOneListing({ slug }),
  getSlugs,
  update,
  listingStatuses: models.listing.attributes.status.values
};
