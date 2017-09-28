'use strict';

module.exports = {

  up: function (queryInterface) {
    return queryInterface.removeColumn(
      'listings',
      'show_phone'
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'show_phone',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  }
};
