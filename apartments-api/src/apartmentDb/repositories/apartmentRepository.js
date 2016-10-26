'use strict';
const db = require('../dbConnectionProvider');

function* list () {
  return db.models.apartment.findAll({
    include: db.models.building,
    raw: true, // readonly get - no need for full sequlize instances
    fieldMap: {
      'building.street_name': 'street_name',
      'building.house_number': 'house_number'
    }
  });
}

function* create(apartment) {
  const buildingWhere = { street_name: apartment.street_name, house_number: apartment.house_number };
  const existingApartment = yield db.models.apartment.findOne({
    where: { unit: apartment.unit },
    include: [
      { model: db.models.building, where : buildingWhere }
    ]
  });

  if (existingApartment) {
    return existingApartment;
  }

  const buildingResult = yield db.models.building.findOrCreate({ where: buildingWhere });
  let newApartment = db.models.apartment.build(apartment);
  newApartment.building_id = buildingResult[0].id;
  return newApartment.save();
}

module.exports = {
  list,
  create
};
