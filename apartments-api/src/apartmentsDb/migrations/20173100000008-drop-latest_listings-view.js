'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'DROP VIEW latest_listings', { type: Sequelize.QueryTypes.RAW }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'CREATE VIEW latest_listings AS ' +
      'SELECT listings.* ' +
      'FROM apt_id_lease_end ' +
      'INNER JOIN listings ON ' +
      'listings.apartment_id = apt_id_lease_end.apartment_id ' +
      'AND listings.lease_end = apt_id_lease_end.lease_end'
      , { type: Sequelize.QueryTypes.RAW });
  }
};
