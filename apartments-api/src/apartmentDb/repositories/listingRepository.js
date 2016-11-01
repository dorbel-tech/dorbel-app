'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');

function* create(listing) {
  // TODO: add reference to country

  const city = yield db.models.city.findOne({
    where: listing.apartment.building.city
  });

  if (!city) {
    throw new Error('did not find city');
  }

  const buildingQuery = { street_name: listing.apartment.building.street_name, house_number: listing.apartment.building.house_number, city_id: city.id };
  const existingApartment = yield db.models.apartment.findOne({
    where: { unit: listing.apartment.unit },
    include: [
      { model: db.models.building, where : buildingQuery }
    ]
  });

  if (existingApartment) {
    return existingApartment;
  } else {
    const buildingResult = yield db.models.building.findOrCreate({ where: buildingQuery });
    let newApartment = db.models.apartment.build(apartment);
    newApartment.building_id = buildingResult[0].id;
    return newApartment.save();
  }
}

module.exports = {
  create
};
