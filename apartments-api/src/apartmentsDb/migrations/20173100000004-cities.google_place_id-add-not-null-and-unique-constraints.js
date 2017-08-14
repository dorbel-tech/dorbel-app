'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('cities', 'google_place_id', {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING(50) 
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('cities', 'google_place_id', {
      allowNull: true,
      unique: false,
      type: Sequelize.STRING(50) 
    });
  }
};
