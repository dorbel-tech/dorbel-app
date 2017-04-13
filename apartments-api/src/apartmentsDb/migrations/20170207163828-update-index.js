'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeIndex('neighborhoods', 'neighborhood_name')
      .then(() => {
        queryInterface.addIndex(
          'neighborhoods',
          ['city_id', 'neighborhood_name'],
          {
            indexName: 'unique_city_neighborhood_name',
            indicesType: 'UNIQUE'
          }
        );
      });
  }
};
