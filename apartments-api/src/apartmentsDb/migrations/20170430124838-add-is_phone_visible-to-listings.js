'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'listings',
      'is_phone_visible',
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
      'is_phone_visible'
    );
  }
};
