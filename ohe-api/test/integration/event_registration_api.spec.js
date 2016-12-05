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

  describe('/event/registration', function () {

    describe('POST', function () {
      it('should create a new registation', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: getRandomNumber()
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        yield this.apiClient.createNewRegistration(response.body.id).expect(201).end();
      });

      it('return an error for non existing event', function* () {
        yield this.apiClient.createNewRegistration(999999).expect(404).end();
      });

    });

    describe('DELETE', function () {
      it('should delete a registation', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: getRandomNumber()
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        const registrationResponse = yield this.apiClient.createNewRegistration(response.body.id).expect(201).end();
        yield this.apiClient.deleteRegistration(registrationResponse.body.id).expect(200).end();
      });

      it('should return an error for non existing registration', function* () {
        yield this.apiClient.deleteRegistration(999999).expect(404).end();
      });

    });
  });
});
