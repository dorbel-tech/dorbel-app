'use strict';
const db = require('../dbConnectionProvider');
const Apartment = db.models.Apartment;
const Building = db.models.Building;

function* list () {
  return Apartment.findAll({
    include: Building,
    raw: true, // readonly get - no need for full sequlize instances
    fieldMap: {
      'Building.street_name': 'street_name',
      'Building.house_number': 'house_number'
    }
  });
}

function* create(apartment) {
  const buildingWhere = { street_name: apartment.street_name, house_number: apartment.house_number };
  const existingApartment = yield Apartment.findOne({
    where: { unit: apartment.unit },
    include: [
      { model: Building, where : buildingWhere }
    ]
  });

  if (existingApartment) { return existingApartment; }

  const buildingResult = yield Building.findOrCreate({ where: buildingWhere });
  let newApartment = Apartment.build(apartment);
  newApartment.BuildingId = buildingResult[0].id;
  return newApartment.save();
}

module.exports = {
  list,
  create
};
