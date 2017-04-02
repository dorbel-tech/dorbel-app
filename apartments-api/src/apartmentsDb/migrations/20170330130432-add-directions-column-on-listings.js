'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'listings',
      'directions',
      Sequelize.STRING(255)
    );
  },

  down: function (queryInterface) {
    queryInterface.removeColumn(
      'listings',
      'directions'
    );
  }
};
