'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.addIndex('likes', ['is_active']);
  },

  down: function (queryInterface) {
    return queryInterface.removeIndex('likes', ['is_active']);
  }
};
