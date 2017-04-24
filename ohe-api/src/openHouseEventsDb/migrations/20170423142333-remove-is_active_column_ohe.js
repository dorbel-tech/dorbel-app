'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeColumn('open_house_events', 'is_active');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'open_house_events',
      'is_active',
      Sequelize.BOOLEAN
    );
  }
};
