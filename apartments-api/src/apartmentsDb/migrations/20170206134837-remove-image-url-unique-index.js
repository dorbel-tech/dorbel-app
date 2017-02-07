'use strict';

module.exports = {
  up: function (queryInterface) {
    queryInterface.removeIndex('images', 'url');
  }
};
