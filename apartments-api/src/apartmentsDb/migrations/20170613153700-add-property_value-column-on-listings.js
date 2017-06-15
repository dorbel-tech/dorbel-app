'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'property_value',
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
      'property_value'
    );
  }
};
