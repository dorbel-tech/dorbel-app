'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'directions',
      Sequelize.STRING(255)
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'listings',
      'directions'
    );
  }
};
