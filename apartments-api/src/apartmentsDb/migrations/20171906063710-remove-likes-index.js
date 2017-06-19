'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeIndex('likes', 'primary_compound_index');
  },

  down: function (queryInterface) {
    return queryInterface.addIndex('likes',
      ['liked_user_id', 'listing_id'],
      {
        indexName: 'primary_compound_index',
        indicesType: 'UNIQUE'
      });
  }
};
