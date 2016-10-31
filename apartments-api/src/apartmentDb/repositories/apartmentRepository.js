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
  // TODO: add reference to country
  const city = yield db.models.city.findOne({
    where: { city_name: apartment.city_name }
  });

  const neighborhood = yield db.models.neighborhood.findOne({
    where: { neighborhood_name: apartment.neighborhood_name }
  });

  if (!city && !neighborhood) {
    throw new Error('did not find city or neighborhood');
  } else if (neighborhood.city_id !== city.id) {
    throw new Error('city and neighborhood do not match');
  }

  const buildingWhere = { street_name: apartment.street_name, house_number: apartment.house_number, city_id: city.id };
  const existingApartment = yield db.models.apartment.findOne({
    where: { unit: apartment.unit },
    include: [
      { model: db.models.building, where : buildingWhere }
    ]
  });

  if (existingApartment) {
    return existingApartment;
  } else {
    const buildingResult = yield db.models.building.findOrCreate({ where: buildingWhere });
    let newApartment = db.models.apartment.build(apartment);
    newApartment.building_id = buildingResult[0].id;
    return newApartment.save();
  }
}

module.exports = {
  list,
  create
};
