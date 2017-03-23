'use strict';

module.exports = {
  up: function (queryInterface) {
    queryInterface.addIndex('likes', ['liked_user_id']);
  },

  down: function (queryInterface) {
    queryInterface.removeIndex('likes', ['liked_user_id']);
  }
};
