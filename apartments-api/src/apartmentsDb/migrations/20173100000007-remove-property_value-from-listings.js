'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeColumn('listings', 'property_value');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'property_value',
      {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
      }
    );
  }
};
