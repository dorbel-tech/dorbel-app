'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeColumn('open_house_events', 'comments');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'open_house_events',
      'comments',
      Sequelize.STRING
    );
  }
};
