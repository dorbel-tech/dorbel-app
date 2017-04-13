'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.addIndex(
      'listings',
      ['slug'],
      {
        indexName: 'ListingSlugIndex',
        indicesType: 'UNIQUE'
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeIndex('listings', 'ListingSlugIndex');
  }
};
