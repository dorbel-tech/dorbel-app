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

  // properties that are not part of the unique constraint but might still need to be updated
  const nonUniqueProps = Object.assign(_.pick(building, ['geolocation', 'elevator', 'floors']));

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

  return buildingResult;
}

module.exports = {
  updateOrCreate
};
