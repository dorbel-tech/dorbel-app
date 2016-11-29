'use strict';
var faker = require('faker');

function getFakeUser() {
  return {
    id: faker.random.uuid(),
    email: faker.internet.email()
  };
}

module.exports = {
  getFakeUser
};
