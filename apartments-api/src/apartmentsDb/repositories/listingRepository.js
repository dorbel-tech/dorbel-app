'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');
const helper = require('./repositoryHelper');
const apartmentRepository = require('./apartmentRepository');
const buildingRepository = require('./buildingRepository');

const fullListingDataInclude = [
  {
    model: models.apartment,
    include: [{
      model: models.building,
      include: [models.city, models.neighborhood]
    }]
  },
  models.image
];

function list(query, options = {}) {
  return models.listing.findAll({
    where: query,

    include: [{
      model: models.apartment,
      include: {
        model: models.building,
        include: {
          model: models.city
        },
        where: options.buildingQuery || {}
      },
      required: true,
      where: options.apartmentQuery || {}
    }, models.image],

    limit: options.limit,
    order: options.order
  });
}

function getById(id) {
  return models.listing.findOne({
    where: {
      id
    },
    include: fullListingDataInclude
  });
}

// TODO: unify byId and bySlug
function getBySlug(slug) {
  return models.listing.findOne({
    where: {
      slug
    },
    include: fullListingDataInclude
  });
}

function* create(listing) {
  // TODO: add reference to country
  // TODO: should much of this be in the listingService ? findOrCreate for building and apartment is actually business logic and not persistance logic |:
  const city = yield models.city.findOne({
    where: listing.apartment.building.city
  });
  if (!city) { throw new Error('did not find city'); }

  const neighborhood = yield models.neighborhood.findOne({
    where: listing.apartment.building.neighborhood
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
    where: {
      id: apartment.building.city.city_id
    }
  };

  const includeNeighborhood = {
    model: models.neighborhood,
    where: {
      id: apartment.building.neighborhood.neighborhood_id
    }
  };

  const includeBuildings = [{
    model: models.building,
    where: {
      street_name: apartment.building.street_name,
      house_number: apartment.building.house_number
    },
    include: [includeCity, includeNeighborhood]
  }];

  const includeApartment = [{
    model: models.apartment,
    where: {
      apt_number: apartment.apt_number
    },
    include: includeBuildings
  }];

  return models.listing.findAll({
    where: listingQuery,
    include: includeApartment,
    raw: true
  });
}

module.exports = {
  list,
  create,
  getListingsForApartment,
  getById,
  getBySlug,
  listingStatuses: models.listing.attributes.status.values
};
