'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.query(`UPDATE likes
      SET likes.apartment_id = (
        SELECT listings.apartment_id
        FROM listings
        WHERE listings.id = likes.listing_id
      )`);
  }
};
