'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.addIndex('likes', ['liked_user_id']);
  },

  down: function (queryInterface) {
    return queryInterface.removeIndex('likes', ['liked_user_id']);
  }
};
