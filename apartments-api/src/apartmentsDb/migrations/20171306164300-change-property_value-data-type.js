'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'listings',
      'property_value',
      {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'listings',
      'property_value',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }
    );
  }
};
