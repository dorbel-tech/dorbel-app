'use strict';
const faker = require('faker');
const _ = require('lodash');
const moment = require('moment');
const fakeUserId = '00000000-0000-0000-0000-000000000001';

function getFakeUser(variant) {
  let randUuid = faker.random.uuid();
  return _.extend({
    id: randUuid,
    user_id: randUuid,
    email: faker.internet.email(),
    phone: getRandomNumber().toString(),
    role: 'user'
  }, variant);
}

function generateEvent(variant) {
  return _.extend({
    id: 1,
    listing_id: 1,
    is_active: true,
    start_time: moment().add(5, 'hours').toDate(),
    end_time: moment().add(6, 'hours').toDate(),
    comments: 'בדיקה',
    max_attendies: 7,
    publishing_user_id: fakeUserId,
    listing_publishing_user_id: fakeUserId,
    isOpenForRegistration: true,
    registrations: []
  }, variant);
}

function generateRegistration(variant) {
  return _.extend({
    id: 1,
    open_house_event_id: 1,
    registered_user_id: fakeUserId,
    is_active: true
  }, variant);
}

function generateFollower(variant) {
  return _.extend({
    id: 1,
    listing_id: 1,
    following_user_id: fakeUserId,
    is_active: true
  }, variant);
}

function getRandomNumber() {
  const min = 1000;
  const max = 100000;
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  fakeUserId,
  getFakeUser,
  generateEvent,
  generateRegistration,
  generateFollower,
  getRandomNumber
};
