module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER VIEW latest_listings AS SELECT * FROM listings WHERE id IN ( ' +
      'SELECT MAX(id) FROM listings WHERE status != \'deleted\'' +
      'GROUP BY apartment_id' +
      ')', { type: Sequelize.QueryTypes.RAW }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER VIEW latest_listings AS ' +
      'SELECT listings.* ' +
      'FROM apt_id_lease_end ' +
      'INNER JOIN listings ON ' +
      'listings.apartment_id = apt_id_lease_end.apartment_id ' +
      'AND listings.lease_end = apt_id_lease_end.lease_end'
      , { type: Sequelize.QueryTypes.RAW });
  }
};
