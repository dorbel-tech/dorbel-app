'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'CREATE VIEW latest_listings AS SELECT * FROM listings WHERE id IN ( ' +
      'SELECT MAX(id) FROM listings WHERE status != \'deleted\'' +
      'GROUP BY apartment_id' +
      ')'
      , { type: Sequelize.QueryTypes.RAW });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'DROP VIEW latest_listings'
      , { type: Sequelize.QueryTypes.RAW });
  }
};
