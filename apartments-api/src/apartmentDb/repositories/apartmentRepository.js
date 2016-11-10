'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');
const helper = require('./repositoryHelper');

function* findOrCreate(apt_number: string, building_id: integer, apartment) {
  const apartmentResult = yield db.models.apartment.findOrCreate({
    where: { building_id, apt_number },
    defaults: _.pick(apartment, helper.getModelFieldNames(db.models.apartment))
  });

  return apartmentResult[0];
}

module.exports = {
  findOrCreate
};
