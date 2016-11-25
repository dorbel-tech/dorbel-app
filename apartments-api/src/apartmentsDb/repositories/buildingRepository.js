'use strict';
const db = require('../dbConnectionProvider');

function* findOrCreate(street_name: string, house_number: string, city_id: integer) {
  const buildingResult = yield db.models.building.findOrCreate({
    where: { street_name, house_number, city_id }
  });

  return buildingResult[0];
}

module.exports = {
  findOrCreate
};
