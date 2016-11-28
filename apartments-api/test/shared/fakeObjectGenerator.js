'use strict';
var faker = require('faker');

function getDateString() {
  return (new Date()).toISOString().substring(0, 10);
}

function getFakeListing() {
  return {
    monthly_rent: faker.random.number(),
    lease_start: getDateString(),
    lease_end: getDateString(),
    publishing_user_id: faker.random.uuid(),
    publishing_user_type: 'landlord',
    apartment: {
      apt_number: faker.random.number(99) + faker.random.word()[0], // like '57D'
      rooms: 3,
      size: 35,
      floor: 3,
      building: {
        street_name: 'רוטשילד',
        house_number: '192',
        city: {
          city_name: 'תל אביב'
        }
      }
    },
    images: [{ url: faker.internet.url() }]
  };
}

function getFakeUser() {
  return {
    id: faker.random.uuid(),
    email: faker.internet.email()
  };
}

module.exports = {
  getFakeListing,
  getFakeUser
};
