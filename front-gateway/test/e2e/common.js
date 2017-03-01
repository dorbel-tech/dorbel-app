const _ = require('lodash');

const E2E_USER_LANDLORD = {
  email: 'e2e-user@dorbel.com',
  password: 'JZ0PZ5NUcKlsez7lfQpN',
  firstName: 'Landlord',
  phone: '123456789'
};
const E2E_USER_TENANT = {
  email: 'e2e-user-tenant@dorbel.com',
  password: 'R9c&l9B$F%5L',
  firstName: 'Tenant',
  phone: '011111111'
};
const E2E_USER_ADMIN = {
  email: 'e2e-user-admin@dorbel.com',
  password: '1Tz#N#7a#eeU',
  firstName: 'Admin',
  phone: '987654321'
};

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

// Return a random number between 1 and 10.
function getSmallRandomNumber() {
  return _.random(1, 10);
}

// Return a random number between 10 and 100.
function getMediumRandomNumber() {
  return _.random(10, 100);
}

// Return a random number between 1000 and 10000.
function getBigRandomNumber() {
  return _.random(1000, 10000);
}

module.exports = {
  getTestUser,
  getSmallRandomNumber,
  getMediumRandomNumber,
  getBigRandomNumber
};
