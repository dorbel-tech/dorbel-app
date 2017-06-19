'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'original_listing_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'listings',
      'original_listing_id'
    );
  }
};
