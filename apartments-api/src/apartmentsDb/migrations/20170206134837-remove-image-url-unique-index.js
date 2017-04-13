'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeIndex('images', 'url');
  }
};
