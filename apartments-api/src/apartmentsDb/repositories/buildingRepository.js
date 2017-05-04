'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ValidationError = shared.utils.domainErrors.DomainValidationError;

function* findOrCreate(building, options = {}) {
  // TODO: add reference to country
  const city = yield db.models.city.findOne({
    where: { id: building.city.id },
    raw: true
  });
  if (!city) {
    logger.error({ city_id: building.city.id }, 'City not found!');
    throw new ValidationError('city not found', building.city, 'העיר לא נמצאה');
  }

  const neighborhood = yield db.models.neighborhood.findOne({
    where: { id: building.neighborhood.id },
    raw: true
  });
  if (!neighborhood) {
    logger.error({ neighborhood_id: building.neighborhood.id }, 'Neighborhood not found!');
    throw new ValidationError('neighborhood not found', building.neighborhood, 'השכונה לא נמצאה');
  }

  if (city.id !== neighborhood.city_id) {
    logger.error({ city_id: city.id, neighborhood_city_id: neighborhood.city_id, neighborhood_id: neighborhood.id }, 'Neighborhood city mismatch!');
    throw new ValidationError('neighborhood city mismatch', building, 'אין התאמה בין עיר לשכונה');
  }

  const findOrCreateResult = yield db.models.building.findOrCreate({
    where: {
      street_name: building.street_name,
      house_number: building.house_number,
      city_id: building.city.id,
      entrance: building.entrance || null
    },
    defaults: _.pick(building, ['geolocation', 'elevator', 'floors', 'neighborhood_id']),
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
