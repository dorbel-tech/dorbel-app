/**
* This file is meant to build the seeds needed for integration testing.
* It's in a separate folder so it won't run together with the regular seed.
*
* We expect the cities and neighborhoods to be already filled in in the regular seed
* And buildings/apartments/listings to be empty
*/
'use strict';
const co = require('co');
const moment = require('moment');
const db = require('../dbConnectionProvider');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';
const TEST_LISTING_ID = 1;
const TEST_LIKES = {
  // used for is_active = true entries
  real: [
    {
      email: 'ohetest1@dorbel-test.com', // email and password: added just in case we ever need to make changes in auth0
      password: '123456',
      id: '9212ce50-bc25-4737-afc7-74207b9ebadb',
      db_record_id: 1 // added to prevent duplicate follower/ohe registartion entries in upsert
    },
    {
      email: 'ohetest2@dorbel-test.com',
      password: '123456',
      id: '9a3a66cb-143b-444f-a153-025ffd4db4ed',
      db_record_id: 2
    }
  ],
  // used for is_active = false entries
  fake: [
    {
      id: '00000000-mock-test-user-000000000001',
      db_record_id: 3
    },
    {
      id: '00000000-mock-test-user-000000000002',
      db_record_id: 4
    }
  ]
};

const MONTHLY_RENT = 5500;
const ROOMS = 1.5;

function* buildTestSeed() {
  yield db.connect();

  const telaviv = yield db.models.city.find({ name: 'תל אביב' });
  const merkazHair = yield db.models.neighborhood.find({ name: 'מרכז העיר', city: telaviv });

  yield createApartment(telaviv, merkazHair, 1, 'best-apt-test');
  yield createApartment(telaviv, merkazHair, 2, '123-slug');
  yield createApartment(telaviv, merkazHair, 3, '123-slug slug');
  yield createLikes();
  yield createSavedFilter(telaviv.id, merkazHair.id);
}

function* createApartment(city, neighborhood, id, slug) {
  yield db.models.building.upsert({
    id: 1,
    street_name: 'שדרות רוטשילד',
    house_number: 129,
    floors: 5,
    geolocation: { type: 'Point', coordinates: [34.7787543, 32.0708966] },
    elevator: 1,
    city_id: city.id,
    neighborhood_id: neighborhood.id,
  });

  yield db.models.apartment.upsert({
    id: id,
    apt_number: id,
    size: 65,
    rooms: ROOMS,
    floor: 2,
    parking: 1,
    pets: 1,
    air_conditioning: 1,
    building_id: 1
  });

  yield db.models.listing.upsert({
    id: id,
    title: 'דירה לבדיקה',
    description: 'הדירה של הבדיקות האוטומטיות',
    status: 'listed',
    monthly_rent: MONTHLY_RENT,
    roommates: 0,
    property_tax: 500,
    board_fee: 120,
    lease_start: moment().add(id, 'day').toDate(),
    lease_end: moment().add(id, 'day').add(1, 'year').toDate(),
    publishing_user_id: TEST_USER_ID,
    publishing_user_type: 'landlord',
    apartment_id: id,
    slug: slug,
    created_at: moment().subtract(id, 'day').toDate()
  });

  yield db.models.image.create({
    url: 'http://lorempixel.com/1000/500/?' + Math.round(Math.random() * 10000),
    display_order: 0,
    listing_id: id
  });
}

function* createLikes() {
  yield TEST_LIKES.real.map(function* (user) {
    yield db.models.like.upsert({
      id: user.db_record_id,
      apartment_id: TEST_LISTING_ID,
      listing_id: TEST_LISTING_ID,
      liked_user_id: user.id,
      is_active: true
    });
  });

  yield TEST_LIKES.fake.map(function* (user) {
    yield db.models.like.upsert({
      id: user.db_record_id,
      apartment_id: TEST_LISTING_ID,
      listing_id: TEST_LISTING_ID,
      liked_user_id: user.id,
      is_active: false
    });
  });
}

function * createSavedFilter(cityId, neighborhoodId) {
  yield db.models.filter.upsert({
    id: 1,
    email_notification: true,
    dorbel_user_id: TEST_USER_ID,
    city: cityId,
    neighborhood: neighborhoodId,
    min_rooms: ROOMS - 0.5,
    max_rooms: ROOMS + 1,
    min_monthly_rent: MONTHLY_RENT - 1000,
    max_monthly_rent: MONTHLY_RENT + 500
  });
}

if (require.main === module) {
  co(buildTestSeed)
    .then(() => {
      logger.info('test seed completed');
      process.exit(0);
    })
    .catch(err => {
      logger.error(err, 'test seed failed');
      process.exit(1);
    });
}
