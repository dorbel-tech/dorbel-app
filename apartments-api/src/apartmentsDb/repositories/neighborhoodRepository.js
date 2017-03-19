'use strict';
const db = require('../dbConnectionProvider');

function getByCityId(city_id) {
  return db.models.neighborhood.findAll({
    where: {
      city_id: city_id,      
      is_active: true
    },
    order: 'display_order, neighborhood_name',
    raw: true
  });
}

module.exports = {
  getByCityId
};
