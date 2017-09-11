'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeIndex('cities', 'google_place_id')
      .then(() => {
        return queryInterface.removeColumn('cities', 'google_place_id');
      });
  },

  // No down interface because the creation was done in 3 steps and we don't really use the 'down' anyways
};
