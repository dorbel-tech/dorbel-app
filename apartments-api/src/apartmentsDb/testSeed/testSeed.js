/**
* This file is meant to build the seeds needed for integration testing.
* It's in a separate folder so it won't run together with the regular seed.
*
* We expect the cities and neighborhoods to be already filled in in the regular seed
* And buildings/apartments/listings to be empty
*/
'use strict';
const co = require('co');
const db = require('../dbConnectionProvider');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';

function* buildTestSeed() {
  yield db.connect();

  const telaviv = yield db.models.city.find({ name: 'תל אביב' });
  const merkazHair = yield db.models.neighborhood.find({ name: 'מרכז העיר', city: telaviv });

  yield db.models.building.upsert({
    id: 1,
    street_name: 'שדרות רוטשילד',
    house_number: 129,
    floors: 5,
    geolocation: { type: 'Point', coordinates: [34.7787543, 32.0708966] },
    elevator: 1,
    city_id: telaviv.id,
    neighborhood_id: merkazHair.id,
  });

  yield db.models.apartment.upsert({
    id: 1,
    apt_number: 11,
    size: 65,
    rooms: 1.5,
    floor: 2,
    parking: 1,
    pets: 1,
    air_conditioning: 1,
    building_id: 1
  });

  yield db.models.listing.upsert({
    id: 1,
    title: 'דירה לבדיקה',
    description: 'הדירה של הבדיקות האוטומטיות',
    status: 'listed',
    monthly_rent: 5500,
    roommates: 0,
    property_tax: 500,
    board_fee: 120,
    lease_start: new Date(),
    lease_end: new Date(),
    publishing_user_id: TEST_USER_ID,
    publishing_user_type: 'landlord',
    apartment_id: 1,
    slug: 'best-apt-test'
  });

  yield db.models.image.create({
    url: 'http://lorempixel.com/1000/500/?' + Math.round(Math.random() * 10000),
    display_order: 0,
    listing_id: 1
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
