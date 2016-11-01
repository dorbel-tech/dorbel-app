'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const helper = require('./repositoryHelper');

function* findOrCreate(unit: string, building_id: integer, apartment) {
  const apartmentResult = yield db.models.apartment.findOrCreate({
    where: { building_id, unit },
    defaults: _.pick(apartment, helper.getModelFieldNames(db.models.apartment))
  });

  return apartmentResult[0];
}

module.exports = {
  findOrCreate
};
