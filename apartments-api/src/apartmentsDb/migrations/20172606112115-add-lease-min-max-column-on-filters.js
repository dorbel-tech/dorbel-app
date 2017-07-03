'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'filters',
      'min_lease_start',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    ).then(() => queryInterface.addColumn(
      'filters',
      'max_lease_start',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    ));
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'filters',
      'min_lease_start'
    ).then(() => queryInterface.removeColumn(
      'filters',
      'max_lease_start'
    ));
  }
};
