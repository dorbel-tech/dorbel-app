/*
* This file is meant to build the seeds needed for integration testing.
* It's in a separate folder so it won't run together with the regular seed.
*/
'use strict';
const co = require('co');
const db = require('../dbConnectionProvider');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const moment = require('moment');

const TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';
const TEST_OHE_ID = 1;
const TEST_LISTING_ID = 1;
const TEST_REGISTRATIONS = {
  // used for is_active = true entries
  real: [
    {
      email: 'ohetest1@dorbel-test.com', // email and password: added just in case we ever need to make changes in auth0
      password: '123456',
      id: '9212ce50-bc25-4737-afc7-74207b9ebadb',
      db_record_id: 1 // added to prevent duplicate ohe registartion entries in upsert
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

function* buildTestSeed() {
  yield db.connect();

  yield db.models.open_house_event.upsert({
    id: TEST_OHE_ID,
    listing_id: TEST_LISTING_ID,
    publishing_user_id: TEST_USER_ID,
    start_time: moment().add(1, 'days').set({ hour: 10, minute: 30, second: 0, millisecond: 0 }), // 10:30am tomorrow
    end_time: moment().add(1, 'days').set({ hour: 12, minute: 0, second: 0, millisecond: 0 }), // 12:00pm tomorrow
    max_attendies: 10,
    status: 'active'
  });

   yield createRegistrations();
}

function* createRegistrations() {
  yield TEST_REGISTRATIONS.real.map(function* (user) {
    yield db.models.registration.upsert({
      id: user.db_record_id,
      open_house_event_id: TEST_OHE_ID,
      registered_user_id: user.id,
      is_active: true
    });
  });

  yield TEST_REGISTRATIONS.fake.map(function* (user) {
    yield db.models.registration.upsert({
      id: user.db_record_id,
      open_house_event_id: TEST_OHE_ID,
      registered_user_id: user.id,
      is_active: false
    });
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
