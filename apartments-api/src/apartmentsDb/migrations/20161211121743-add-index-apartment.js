'use strict';
module.exports = {
  up: function(queryInterface) {
    return queryInterface.addIndex(
      'apartments',
      ['building_id', 'apt_number'],
      {
        indexName: 'apartments_index',
        indicesType: 'UNIQUE'
      }
    );
  },
  down: function(queryInterface) {
    return queryInterface.removeIndex('apartments', 'apartments_index');
  }
};
