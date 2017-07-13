'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE `likes` DROP FOREIGN KEY `apartment_id_foreign_idx`; '
      , { type: Sequelize.QueryTypes.RAW })
      .then(() => {
        return queryInterface.sequelize.query(
          'ALTER TABLE `likes` ' +
          'ADD CONSTRAINT `apartment_id_foreign_idx` ' +
          'FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE CASCADE;'
          , { type: Sequelize.QueryTypes.RAW });
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE `likes` DROP FOREIGN KEY `apartment_id_foreign_idx`; '
      , { type: Sequelize.QueryTypes.RAW })
      .then(() => {
        return queryInterface.sequelize.query(
          'ALTER TABLE `likes` ' +
          'ADD CONSTRAINT `apartment_id_foreign_idx` ' +
          'FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE NO ACTION;'
          , { type: Sequelize.QueryTypes.RAW });
      });
  }
};
