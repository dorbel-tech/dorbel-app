'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('listings', 'description', { type: Sequelize.STRING(500) });
  },
};
