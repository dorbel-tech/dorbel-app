'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'listings',
      'show_phone',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.removeColumn(
      'listings',
      'show_phone'
    );
  }
};
