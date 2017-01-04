'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('open_house_events', 'max_attendies',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 15
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.removeColumn('open_house_events', 'max_attendies');
  }
};
