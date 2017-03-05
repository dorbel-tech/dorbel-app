'use stric';
const _ = require('lodash');
const E2E_USER_LANDLORD = { email: 'e2e-user@dorbel.com', password: 'e2e_test', firstName: 'Landlord', phone: '123456789' };
const E2E_USER_TENANT = { email: 'e2e-user-tenant@dorbel.com', password: 'e2e_test', firstName: 'Tenant', phone: '011111111' };
const E2E_USER_ADMIN = { email: 'e2e-user-admin@dorbel.com', password: 'e2e_test', firstName: 'Admin', phone: '987654321' };

function getTestUser(userType) {
  switch (userType) {
    case 'admin':
      return E2E_USER_ADMIN;          
    case 'landlord':
      return E2E_USER_LANDLORD;          
    case 'tenant':
      return E2E_USER_TENANT;          
  }
}

function getBaseUrl() {
  return process.env.FRONT_GATEWAY_URL || 'http://localhost:3001';
}

function getSmallRandomNumber() {
  return _.random(1, 10); // Return a random number between 1 and 10.
}

function getMediumRandomNumber() {
  return _.random(10, 100); // Return a random number between 10 and 100.
}

function getBigRandomNumber() {
  return _.random(1000, 10000); // Return a random number between 1000 and 10000.
}

function waitForText(context, element, text) {
  return context.waitForText(element, (t) => ( t === text ));
}

module.exports = {
  getTestUser,
  getBaseUrl,
  getSmallRandomNumber,
  getMediumRandomNumber,
  getBigRandomNumber,
  waitForText
};
