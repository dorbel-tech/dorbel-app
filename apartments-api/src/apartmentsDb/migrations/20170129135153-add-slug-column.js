'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'listings',
      'slug',
      Sequelize.STRING
    );
  },

  down: function (queryInterface) {
    queryInterface.removeColumn(
      'listings',
      'slug'
    );
  }
};
