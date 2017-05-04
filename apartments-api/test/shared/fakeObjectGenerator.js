'use strict';
var faker = require('faker');

function getDateString() {
  return (new Date()).toISOString().substring(0, 10);
}

function getFakeBuilding(variant) {
  return Object.assign({
    street_name: 'רוטשילד',
    house_number: '192',
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

function getFakeListing() {
  const listing =  {
    status: 'listed',
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
      building: getFakeBuilding()
    },
    open_house_event_date: getDateString(),
    open_house_event_start_time: '07:00',
    open_house_event_end_time: '07:30',
    images: [ getFakeImage() ],
    user: {
      phone: '123456789'
    },
    slug: 'test-listing-' + faker.random.uuid() // This field has a unique constraint
  };

  listing.apartment.building.toJSON = () => listing.apartment.building;
  listing.get = () => { return listing; };
  return listing;
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
