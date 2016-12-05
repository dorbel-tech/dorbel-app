'use strict';
const db = require('../dbConnectionProvider');
const _ = require('lodash');

function* findOrCreate(building) {
  const buildingResult = yield db.models.building.findOrCreate({
    where: _.pick(building, ['street_name', 'house_number', 'city_id']),
    defaults: _.pick(building, ['geolocation', 'elevator'])
  });

  return buildingResult[0];
}

module.exports = {
  findOrCreate
};
