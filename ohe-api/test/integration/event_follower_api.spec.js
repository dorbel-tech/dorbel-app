'use strict';
describe('Open House Events Registration API Integration', function () {
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

  describe('/event/follow', function () {

    describe('POST', function () {
      it('should create a new follower', function* () {
        yield this.apiClient.createNewFollower(getRandomNumber()).expect(201).end();
      });
    });

    describe('DELETE', function () {
      it('should delete a follower', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: getRandomNumber()
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        const registrationResponse = yield this.apiClient.createNewFollower(response.body.id).expect(201).end();
        yield this.apiClient.deleteFollower(registrationResponse.body.id).expect(200).end();
      });

      it('should return an error for non existing follow', function* () {
        yield this.apiClient.deleteFollower(999999).expect(404).end();
      });

    });
  });
});
