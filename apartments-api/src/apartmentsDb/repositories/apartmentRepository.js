'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const helper = require('./repositoryHelper');

const UPSERT_WHITELIST = [ 'size', 'rooms', 'floor', 'parking', 'sun_heated_boiler', 'pets', 'air_conditioning', 'balcony', 'security_bars', 'parquet_floor' ];

async function updateOrCreate(apt_number, building_id, apartment) {
  const findOrCreateResult = await db.models.apartment.findOrCreate({
    where: { building_id, apt_number },
    defaults: _.pick(apartment, helper.getModelFieldNames(db.models.apartment)),
    include: [db.models.building]
  });

  const apartmentResult = findOrCreateResult[0];

  if (!apartmentResult.isNewRecord) {
    await apartmentResult.update(_.pick(apartment, UPSERT_WHITELIST));
  }

  return apartmentResult;
}

module.exports = {
  updateOrCreate
};
