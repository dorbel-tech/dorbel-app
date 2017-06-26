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
