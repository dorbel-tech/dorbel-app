'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ValidationError = shared.utils.domainErrors.DomainValidationError;

async function updateOrCreate(building, options = {}) {
  // TODO: add reference to country
  const city = await db.models.city.findOne({
    where: { id: building.city.id },
    raw: true
  });
  if (!city) {
    logger.error({ city_id: building.city.id }, 'City not found!');
    throw new ValidationError('city not found', building.city, 'העיר לא נמצאה');
  }

  const neighborhood = await db.models.neighborhood.findOne({
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

  // properties that are not part of the unique constraint but might still need to be updated
  const nonUniqueProps = Object.assign(_.pick(building, ['geolocation', 'elevator', 'floors']), { neighborhood_id: building.neighborhood.id });

  const findOrCreateResult = await db.models.building.findOrCreate({
    where: {
      street_name: building.street_name,
      house_number: building.house_number,
      city_id: building.city.id,
      entrance: building.entrance || null
    },
    defaults: nonUniqueProps,
    transaction: options.transaction
  });

  const buildingResult = findOrCreateResult[0];

  // Find or create doen't update props if row was found - so we update them seperately if needed
  if (!buildingResult.isNewRecord) {
    await buildingResult.update(nonUniqueProps, { transaction: options.transaction });
  }

  buildingResult.city = city;
  buildingResult.neighborhood = neighborhood;

  return buildingResult;
}

module.exports = {
  updateOrCreate
};
