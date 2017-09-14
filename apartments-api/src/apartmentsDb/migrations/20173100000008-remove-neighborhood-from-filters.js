'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeColumn('filters', 'neighborhood');
  }

  // No down interface because we don't really use the 'down' anyways
};
