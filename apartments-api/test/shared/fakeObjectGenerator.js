'use strict';
var faker = require('faker');
const fakeUserId = '00000000-0000-0000-0000-000000000001';

function getDateString(date) {
  return (date || new Date()).toISOString().substring(0, 10);
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
    status: 'listed',
    monthly_rent: faker.random.number({ min: 1000, max: 9000 }),
    lease_start: getDateString(),
    lease_end: getDateString(),
    publishing_user_id: faker.random.uuid(),
    publishing_user_type: 'landlord',
    apartment: {
      apt_number: faker.random.number(99) + faker.random.word()[0] + faker.random.word()[0], // like '57AB'
      rooms: faker.random.number({ min: 2, max: 10 }),
      size: faker.random.number(120),
      floor: faker.random.number(10),
      building: getFakeBuilding()
    },
    open_house_event_date: getDateString(),
    open_house_event_start_time: '07:00',
    open_house_event_end_time: '07:30',
    images: [ getFakeImage(true) ],
    user: {
      phone: '123456789'
    }
  };

  listing.apartment.building.toJSON = () => listing.apartment.building;
  listing.get = () => listing;
  return Object.assign(listing, variant);
}

function getFakeImage(is_cover_image) {
  return { url: 'http://lorempixel.com/1000/500/?' + faker.random.number(9999), display_order: is_cover_image ? 0 : 99 };
}

function getFakeUser(variant) {
  return Object.assign({
    id: faker.random.uuid(),
    email: faker.internet.email()
  }, variant);
}

function getFakeLike(variant) {
  let like = Object.assign({
    id: 1,
    apartment_id: 1,
    listing_id: 1,
    liked_user_id: fakeUserId,
    is_active: true
  }, variant);
  like.get = () => { return like; };
  return like;
}

function getFakeDocument(variant) {
  return Object.assign({
    provider: 'filestack',
    provider_file_id: faker.random.word(),
    filename: faker.system.fileName(),
    type: faker.system.mimeType()
  }, variant);
}

module.exports = {
  getFakeListing,
  getFakeUser,
  getFakeImage,
  getFakeBuilding,
  getFakeLike,
  getDateString,
  getFakeDocument
};
