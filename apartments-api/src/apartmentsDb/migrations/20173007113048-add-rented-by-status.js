'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'rented_by',
      {
        type: Sequelize.ENUM('dorbel', 'other'),
        allowNull: true,
        defaultValue: null
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'listings',
      'rented_by'
    );
  }
};
