'use strict';

module.exports = {
  up: function (queryInterface) {
    queryInterface.removeIndex('neighborhoods', 'neighborhood_name');
    queryInterface.addIndex(
      'neighborhoods',
      ['city_id', 'neighborhood_name'],
      {
        indexName: 'neighborhoods_index',
        indicesType: 'UNIQUE'
      }
    );    
  }
};
