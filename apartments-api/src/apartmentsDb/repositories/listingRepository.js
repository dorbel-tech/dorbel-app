'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');
const helper = require('./repositoryHelper');
const apartmentRepository = require('./apartmentRepository');
const buildingRepository = require('./buildingRepository');

const listingAttributes = { exclude: [ 'lease_end', 'updated_at' ] };
const apartmentAttributes = { exclude: [ 'created_at', 'updated_at' ] };
const buildingAttributes = { exclude: [ 'created_at', 'updated_at' ] };
const cityAttributes = [ 'id', 'city_name' ];
const neighborhoodAttributes = [ 'id', 'neighborhood_name', 'city_id' ];
const imageAttributes = { exclude: [ 'created_at', 'updated_at' ] };

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
    attributes: ['id', 'slug', 'title', 'monthly_rent', 'roommate_needed', 'lease_start', 'status'],
    where: query,
    include: [{
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
      // all attributes are selected to resolve: https://github.com/sequelize/sequelize/issues/4694#issuecomment-215745576
      order: 'display_order ASC',
      limit: 1,
    }],

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
  // TODO: add reference to country
  // TODO: should much of this be in the listingService ? findOrCreate for building and apartment is actually business logic and not persistance logic |:
  const city = yield models.city.findOne({
    where: listing.apartment.building.city,
    raw: true
  });
  if (!city) { throw new Error('did not find city'); }

  const neighborhood = yield models.neighborhood.findOne({
    where: listing.apartment.building.neighborhood,
    raw: true
  });
  if (!neighborhood) { throw new Error('did not find neighborhood'); }

  if (city.id !== neighborhood.city_id) { throw new Error('neighborhood doesnt match city'); }

  listing.apartment.building.city_id = city.id;
  listing.apartment.building.neighborhood_id = neighborhood.id;
  const building = yield buildingRepository.findOrCreate(listing.apartment.building);

  const apartment = yield apartmentRepository.findOrCreate(
    listing.apartment.apt_number,
    building.id,
    listing.apartment
  );

  let newListing = models.listing.build(_.pick(listing, helper.getModelFieldNames(models.listing)));
  newListing.apartment_id = apartment.id;
  let savedListing = yield newListing.save();

  building.city = city;
  building.neighborhood = neighborhood;
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

module.exports = {
  list,
  create,
  getListingsForApartment,
  getById: id => getOneListing({ id }),
  getBySlug: slug => getOneListing({ slug }),
  getSlugs,
  listingStatuses: models.listing.attributes.status.values
};
