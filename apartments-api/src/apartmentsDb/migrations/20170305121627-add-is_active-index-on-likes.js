'use strict';

module.exports = {
  up: function (queryInterface) {
    queryInterface.addIndex('likes', ['is_active']);
  },

  down: function (queryInterface) {
    queryInterface.removeIndex('likes', ['is_active']);
  }
};
