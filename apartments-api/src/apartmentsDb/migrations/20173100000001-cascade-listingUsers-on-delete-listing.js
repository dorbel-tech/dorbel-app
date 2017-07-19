'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE `listingUsers` DROP FOREIGN KEY `listingUsers_ibfk_1`; '
      , { type: Sequelize.QueryTypes.RAW })
      .then(() => {
        return queryInterface.sequelize.query(
          'ALTER TABLE `listingUsers` ' +
          'ADD CONSTRAINT `listing_id_foreign_key` ' +
          'FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE;'
          , { type: Sequelize.QueryTypes.RAW });
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE `listingUsers` DROP FOREIGN KEY `apartment_id_foreign_key`; '
      , { type: Sequelize.QueryTypes.RAW })
      .then(() => {
        return queryInterface.sequelize.query(
          'ALTER TABLE `listingUsers` ' +
          'ADD CONSTRAINT `listingUsers_ibfk_1` ' +
          'FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE NO ACTION;'
          , { type: Sequelize.QueryTypes.RAW });
      });
  }
};
