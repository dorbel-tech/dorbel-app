'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.addIndex('buildings', ['city_id']);
  },

  down: function (queryInterface) {
    return queryInterface.addIndex('buildings', ['city_id']);
  },
};
