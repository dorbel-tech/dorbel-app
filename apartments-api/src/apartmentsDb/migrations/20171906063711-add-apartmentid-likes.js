'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'likes',
      'apartment_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'likes',
      'apartment_id'
    );
  }
};
