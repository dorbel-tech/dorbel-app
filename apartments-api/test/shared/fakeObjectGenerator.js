'use strict';
var faker = require('faker');

function getDateString() {
  return (new Date()).toISOString().substring(0, 10);
}

function getFakeBuilding(variant) {
  return Object.assign({
    street_name: faker.address.streetName(),
    house_number: '' + faker.random.number(300),
    entrance: 1,
    city_id: 1,
    city: {
      id: 1
    },
    neighborhood_id: 1,
    neighborhood: {
      id: 1
    }
  }, variant);
}

function getFakeListing(variant) {
  const listing =  {
    status: 'pending',
    monthly_rent: faker.random.number(),
    lease_start: getDateString(),
    lease_end: getDateString(),
    publishing_user_id: faker.random.uuid(),
    publishing_user_type: 'landlord',
    apartment: {
      apt_number: faker.random.number(99) + faker.random.word()[0] + faker.random.word()[0], // like '57AB'
      rooms: faker.random.number(10),
      size: faker.random.number(120),
      floor: faker.random.number(10),
      building: getFakeBuilding()
    },
    open_house_event_date: getDateString(),
    open_house_event_start_time: '07:00',
    open_house_event_end_time: '07:30',
    images: [ getFakeImage() ],
    user: {
      phone: '123456789'
    },
    slug: 'test-listing-' + faker.random.uuid(), // This field has a unique constraint
    show_phone: false,
    show_for_future_booking: true
  };

  listing.apartment.building.toJSON = () => listing.apartment.building;
  listing.get = () => listing;
  return Object.assign(listing, variant);
}

function getFakeImage() {
  return { url: 'http://lorempixel.com/1000/500/?' + faker.random.number(9999) };
}

function getFakeUser(variant) {
  return Object.assign({
    id: faker.random.uuid(),
    email: faker.internet.email()
  }, variant);
}

module.exports = {
  getFakeListing,
  getFakeUser,
  getFakeImage,
  getFakeBuilding
};
