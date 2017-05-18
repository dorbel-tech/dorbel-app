'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'show_for_future_booking',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'listings',
      'show_for_future_booking'
    );
  }
};
