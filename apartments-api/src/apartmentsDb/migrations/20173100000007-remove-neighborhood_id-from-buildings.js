'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeColumn('buildings', 'neighborhood_id');
  }

  // No down interface because we don't really use the 'down' anyways
};
