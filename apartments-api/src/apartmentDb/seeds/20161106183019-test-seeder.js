'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('Tests', [{
      foo: 'aaa',
      bar: 'bbb',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('Tests', null, {});
  }
};
