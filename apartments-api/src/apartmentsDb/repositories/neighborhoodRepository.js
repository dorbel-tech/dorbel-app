'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;

function getByCityId(city_id) {
  return models.neighborhood.findAll({
    where: {
      city_id: city_id
    },
    raw: true
  });
}

module.exports = {
  getByCityId
};
