/*
* This file is meant to build the seeds needed for integration testing.
* It's in a separate folder so it won't run together with the regular seed.
*/
'use strict';
const co = require('co');
const db = require('../dbConnectionProvider');
const logger = require('dorbel-shared').logger.getLogger(module);
const moment = require('moment');

const TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';
const TEST_OHE_ID = 1;
const TEST_LISTING_ID = 1;

function* buildTestSeed() {
  yield db.connect();

  yield db.models.open_house_event.upsert({
    id: TEST_OHE_ID,
    listing_id: TEST_LISTING_ID,
    publishing_user_id: TEST_USER_ID,
    start_time: moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), // 10:30am tomorrow
    end_time: moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), // 12:00pm tomorrow
    max_attendies: 10,
    is_active: true
  });

  for (let i = 0; i < 10; i++) {
    yield db.models.registration.upsert({
      open_house_event_id: TEST_OHE_ID,
      registered_user_id: '00000000-0000-0000-0000-00000000000' + i,
      is_active: (i < 5)
    });
  }

  for (let i = 0; i < 10; i++) {
    yield db.models.follower.upsert({
      listing_id: TEST_LISTING_ID,
      following_user_id: '00000000-0000-0000-0000-00000000000' + i,
      is_active: (i < 5)
    });
  }
}

if (require.main === module) {
  co(buildTestSeed)
    .then(() => logger.info('test seed completed'))
    .catch(err => logger.error(err, 'test seed failed'));
}
