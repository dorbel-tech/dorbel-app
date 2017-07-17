'use strict';

// This migration was created in order to add the property_value column to the view.
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER VIEW latest_listings AS ' +
      'SELECT listings.* ' +
      'FROM apt_id_lease_end ' +
      'INNER JOIN listings ON ' +
      'listings.apartment_id = apt_id_lease_end.apartment_id ' +
      'AND listings.lease_end = apt_id_lease_end.lease_end'
      , { type: Sequelize.QueryTypes.RAW });
  },
};

