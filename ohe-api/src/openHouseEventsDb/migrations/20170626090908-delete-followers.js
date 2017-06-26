'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.dropTable('followers');
  }
};
