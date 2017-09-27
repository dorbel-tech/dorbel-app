'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'DROP VIEW apt_id_lease_end', { type: Sequelize.QueryTypes.RAW }
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'CREATE VIEW apt_id_lease_end AS ' +
      'SELECT apartment_id, MAX( lease_end ) as lease_end ' +
      'FROM listings ' +
      'WHERE listings.status <> \'deleted\' ' +
      'GROUP BY apartment_id'
      , { type: Sequelize.QueryTypes.RAW });
  }
};
