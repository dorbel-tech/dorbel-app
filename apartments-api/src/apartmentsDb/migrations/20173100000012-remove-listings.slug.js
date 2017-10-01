'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeIndex('listings', 'ListingSlugIndex')
      .then(() => {
        return queryInterface.removeColumn('listings', 'slug');
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('listings', 'slug', Sequelize.STRING)
      .then(() => {
        return queryInterface.addIndex(
          'listings',
          ['slug'],
          {
            indexName: 'ListingSlugIndex',
            indicesType: 'UNIQUE'
          }
        );
      });
  }
};
