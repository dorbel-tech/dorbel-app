'use strict';
/* 

This migration adds a google_place_id column to the cities table.
It was created in order to prevent naming collisions (פ"ת\פתח תקווה) when Google places support will be added

*/
module.exports = {
  up: function (queryInterface, Sequelize) {
    // Add the column
    return queryInterface.addColumn('cities',
      'google_place_id',
      {
        type: Sequelize.STRING(50),
        allowNull: true,
        default: 'default_value_from_migration'
      });
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'cities',
      'google_place_id'
    );
  }
};
