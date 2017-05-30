'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.addIndex('listings', ['apartment_id', 'lease_end']);
  },

  down: function (queryInterface) {
    return queryInterface.removeIndex('listings', ['apartment_id', 'lease_end']);
  }
};
