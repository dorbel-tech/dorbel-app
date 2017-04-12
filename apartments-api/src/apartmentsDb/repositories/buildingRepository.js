'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const shared = require('dorbel-shared');
const ValidationError = shared.utils.domainErrors.DomainValidationError;

function* findOrCreate(building, options = {}) {
  // TODO: add reference to country
  const city = yield db.models.city.findOne({
    where: building.city,
    raw: true
  });
  if (!city) {
    throw new ValidationError('city not found', building.city, 'city not found');
  }

  const neighborhood = yield db.models.neighborhood.findOne({
    where: building.neighborhood,
    raw: true
  });
  if (!neighborhood) {
    throw new ValidationError('neighborhood not found', building.neighborhood, 'neighborhood not found');
  }

  if (city.id !== neighborhood.city_id) {
    throw new ValidationError('neighborhood city mismatch', building, 'neighborhood city mismatch');
  }

  const findOrCreateResult = yield db.models.building.findOrCreate({
    where: _.pick(building, ['street_name', 'house_number', 'city_id', 'neighborhood_id']),
    defaults: _.pick(building, ['geolocation', 'elevator']),
    transaction: options.transaction
  });

  const buildingResult = findOrCreateResult[0];
  buildingResult.city = city;
  buildingResult.neighborhood = neighborhood;

  return buildingResult;
}

module.exports = {
  findOrCreate
};
