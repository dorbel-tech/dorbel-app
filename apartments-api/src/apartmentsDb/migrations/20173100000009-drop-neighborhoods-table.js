'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.dropTable('neighborhoods');
  }

  // No down interface because we don't really use the 'down' anyways
};
