'use strict';
describe('Apartments API Integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const _ = require('lodash');
  const moment = require('moment');
  const faker = require('../shared/fakeObjectGenerator');

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  function getRandomNumber() {
    let min = 1000;
    let max = 100000;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  describe('/ohe', function () {
    describe('/post', function () {
      it('should create a new open house event', function* () {
        const newEvent = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: getRandomNumber()
        };
        const response = yield this.apiClient.createNewEvent(newEvent).expect(201).end();
      });
    });
  });
});
