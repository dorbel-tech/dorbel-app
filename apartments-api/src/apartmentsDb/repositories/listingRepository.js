'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');
const helper = require('./repositoryHelper');
const apartmentRepository = require('./apartmentRepository');
const buildingRepository = require('./buildingRepository');

function list (query) {
  return models.listing.findAll({
    where: query,
    include: [ { model: models.apartment, include: models.building } ],
    raw: true, // readonly get - no need for full sequlize instances
    fieldMap: {
      'apartment.building.street_name': 'street_name',
      'apartment.building.house_number': 'house_number',
      'apartment.apt_number': 'apt_number'
    }
  });
}

function* create(listing) {
  // TODO: add reference to country
  // TODO: should much of this be in the listingService ? findOrCreate for building and apartment is actually business logic and not persistance logic |:
  const city = yield models.city.findOne({
    where: listing.apartment.building.city
  });

  if (!city) {
    throw new Error('did not find city');
  }

  const building = yield buildingRepository.findOrCreate(listing.apartment.building.street_name, listing.apartment.building.house_number, city.id);
  const apartment = yield apartmentRepository.findOrCreate(listing.apartment.apt_number, building.id, listing.apartment);

  let newListing = models.listing.build(_.pick(listing, helper.getModelFieldNames(models.listing)));
  newListing.apartment_id = apartment.id;
  let savedListing = yield newListing.save();

  building.city = city;
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
  const includeCity = [
    { model: models.city, where: { city_name: apartment.building.city.city_name } }
  ];

  const includeBuildings = [
    { model: models.building, where: { street_name: apartment.building.street_name, house_number: apartment.building.house_number }, include: includeCity }
  ];

  const includeApartment = [
    { model: models.apartment, where: { apt_number: apartment.apt_number }, include: includeBuildings }
  ];

  return models.listing.findAll({
    where: listingQuery,
    include: includeApartment,
    raw: true
  });
}

module.exports = {
  list,
  create,
  getListingsForApartment
};
