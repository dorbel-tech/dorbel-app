'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('Tests', [{
      foo: 'aaa',
      bar: 'bbb'
    }], {});
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('Tests', null, {});
  }
};
