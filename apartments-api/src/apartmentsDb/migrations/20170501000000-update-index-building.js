'use strict';
module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeIndex('buildings', 'buildings_index').then(() => {
      queryInterface.addIndex(
        'buildings',
        ['city_id', 'street_name', 'house_number', 'entrance', 'neighborhood_id'],
        {
          indexName: 'buildings_index',
          indicesType: 'UNIQUE'
        }
      );
    });
  },
  down: function (queryInterface) {
    return queryInterface.removeIndex('buildings', 'buildings_index')
      .then(() => {
        queryInterface.addIndex(
          'buildings',
          ['city_id', 'street_name', 'house_number', 'entrance'],
          {
            indexName: 'buildings_index',
            indicesType: 'UNIQUE'
          }
        );
      });
  }
};
