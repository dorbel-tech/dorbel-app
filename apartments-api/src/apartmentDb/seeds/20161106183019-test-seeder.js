'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('Tests', [{
      foo: 'aaa',
      bar: 'bbb',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('Tests', null, {});
  }
};
