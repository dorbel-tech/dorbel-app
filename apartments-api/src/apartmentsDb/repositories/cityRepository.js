'use strict';
const db = require('../dbConnectionProvider');

function list(query) {
  query = query || {};
  query.is_active = true;
  
  return db.models.city.findAll({
    where: query,
    order: 'display_order',
    raw: true // readonly get - no need for full sequlize instances
  });
}

module.exports = {
  list
};
