'use stric';
const _ = require('lodash');
var faker = require('faker');
const E2E_USER_LANDLORD = { email: 'e2e-user@dorbel.com', password: 'e2e_test', firstName: 'Landlord', lastName: 'Test', phone: '123456789' };
const E2E_USER_TENANT = { email: 'e2e-user-tenant@dorbel.com', password: 'e2e_test', firstName: 'Tenant', lastName: 'Test', phone: '011111111' };
const E2E_USER_ADMIN = { email: 'e2e-user-admin@dorbel.com', password: 'e2e_test', firstName: 'Admin', lastName: 'Test', phone: '987654321' };
const E2E_USER_RANDOM = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.random.number()
};
const IS_CI = process.env.NODE_ENV == 'ci';

function getTestUser(userType) {
  switch (userType) {
    case 'admin':
      return E2E_USER_ADMIN;
    case 'landlord':
      return E2E_USER_LANDLORD;
    case 'tenant':
      return E2E_USER_TENANT;
    case 'random':
      return E2E_USER_RANDOM;
  }
}

function getRandomProfile() {
  return {
    age: faker.random.number({ min: 18, max: 80 }),
    location: faker.address.city(),
    workplace: faker.name.firstName(),
    position: faker.name.lastName(),
    about: faker.name.firstName()};
}

function getBaseUrl() {
  return process.env.FRONT_GATEWAY_URL || 'http://localhost:3001';
}

function getSmallRandomNumber() {
  return _.random(1, 10); // Return a random number between 1 and 10.
}

function getMediumRandomNumber() {
  return _.random(10, 1000); // Return a random number between 10 and 100.
}

function getBigRandomNumber() {
  return _.random(1000, 10000); // Return a random number between 1000 and 10000.
}

function waitForText(context, element, text) {
  if (text) {
    return context.waitForText(element, (t) => {
      console.log('waitForText - expected text:', text);
      console.log('waitForText - actual text:', t);
      return t === text;
    });
  }
}

module.exports = {
  getTestUser,
  getRandomProfile,
  getBaseUrl,
  getSmallRandomNumber,
  getMediumRandomNumber,
  getBigRandomNumber,
  waitForText,
  IS_CI
};
