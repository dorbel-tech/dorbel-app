'use strict';
const db = require('../dbConnectionProvider');

async function findOrCreate(city) {
  const cityRecord = await db.models.city.findOrCreate({
    where: {
      city_name: city.city_name,
      google_place_id: city.google_place_id,
      country_id: city.country_id
    },
    raw: true
  });

  return cityRecord[0];
}

async function list(query) {
  query = query || {};
  query.is_active = true;

  return db.models.city.findAll({
    where: query,
    order: 'display_order, city_name',
    raw: true // readonly get - no need for full sequlize instances
  });
}

module.exports = {
  findOrCreate,
  list
};
