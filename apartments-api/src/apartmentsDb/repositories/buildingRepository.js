'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ValidationError = shared.utils.domainErrors.DomainValidationError;

async function updateOrCreate(building, options = {}) {
  // TODO: add reference to country
  let neighborhood;
  if (building.neighborhood_id) {
    neighborhood = await db.models.neighborhood.findOne({
      where: { id: building.neighborhood_id },
      raw: true
    });
    if (!neighborhood) {
      logger.error({ neighborhood_id: building.neighborhood_id }, 'Neighborhood not found!');
      throw new ValidationError('neighborhood not found', building.neighborhood, 'השכונה לא נמצאה');
    }

    if (building.city_id !== neighborhood.city_id) {
      logger.error({ city_id: building.city_id, neighborhood_city_id: neighborhood.city_id, neighborhood_id: neighborhood.id }, 'Neighborhood city mismatch!');
      throw new ValidationError('neighborhood city mismatch', building, 'אין התאמה בין עיר לשכונה');
    }
  }

  building.neighborhood = neighborhood;

  // properties that are not part of the unique constraint but might still need to be updated
  const nonUniqueProps = Object.assign(_.pick(building, ['geolocation', 'elevator', 'floors']), { neighborhood_id: building.neighborhood_id });

  const findOrCreateResult = await db.models.building.findOrCreate({
    where: {
      street_name: building.street_name,
      house_number: building.house_number,
      city_id: building.city_id,
      entrance: building.entrance || null
    },
    defaults: nonUniqueProps,
    transaction: options.transaction
  });

  const buildingResult = findOrCreateResult[0];

  // Find or create doen't update props if row was found - so we update them seperately if needed
  if (!buildingResult.isNewRecord) {
    await buildingResult.update(nonUniqueProps, {
      include: [db.models.city],
      transaction: options.transaction
    });
  }

  return buildingResult;
}

module.exports = {
  updateOrCreate
};
