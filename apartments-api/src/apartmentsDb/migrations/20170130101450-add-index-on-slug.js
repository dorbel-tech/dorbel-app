'use strict';

module.exports = {
  up: function (queryInterface) {
    queryInterface.addIndex(
      'listings',
      ['slug'],
      {
        indexName: 'ListingSlugIndex',
        indicesType: 'UNIQUE'
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.removeIndex('listings', 'ListingSlugIndex');
  }
};
