'use strict';
const db = require('../dbConnectionProvider');
const apartment = db.models.apartment;
const building = db.models.building;

function* list () {
  return apartment.findAll({
    include: building,
    raw: true, // readonly get - no need for full sequlize instances
    fieldMap: {
      'building.street_name': 'street_name',
      'building.house_number': 'house_number'
    }
  });
}

function* create(apartment) {
  const buildingWhere = { street_name: apartment.street_name, house_number: apartment.house_number };
  const existingApartment = yield apartment.findOne({
    where: { unit: apartment.unit },
    include: [
      { model: building, where : buildingWhere }
    ]
  });

  if (existingApartment) {
    return existingApartment;
  }

  const buildingResult = yield building.findOrCreate({ where: buildingWhere });
  let newApartment = apartment.build(apartment);
  newApartment.building_id = buildingResult[0].id;
  return newApartment.save();
}

module.exports = {
  list,
  create
};
