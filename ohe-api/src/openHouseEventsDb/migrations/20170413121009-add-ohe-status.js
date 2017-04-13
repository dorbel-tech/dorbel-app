'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('open_house_events', 'status',
      {
        type: Sequelize.ENUM,
        values: ['active', 'inactive', 'deleted'],
        allowNull: false,
        defaultValue: 'active'
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('open_house_events', 'status'); 
  }
};
