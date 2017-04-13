'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'listings',
      'slug',
      Sequelize.STRING
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'listings',
      'slug'
    );
  }
};
