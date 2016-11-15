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
      apt_number: '7',
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
    images: [{ url: faker.internet.url() }],
    open_house_events: [{ start_time: new Date(), end_time: new Date() }]
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
