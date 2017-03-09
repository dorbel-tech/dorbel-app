'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE `listings` MODIFY COLUMN `status` enum("pending", "listed", "rented", "unlisted", "deleted")  NOT NULL DEFAULT "pending";');
  }
};
