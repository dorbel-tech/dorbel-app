'use strict';
const ApiClient = require('./apiClient.js');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');

describe('Open House Events Registration API Integration', function () {

  before(function* () {
    this.timeout = (10000);
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  describe('/event/registration', function () {

    describe('POST', function () {
      it('should create a new registation', function* () {
        const ohe = {
          start_time: moment().add(12, 'hours').toISOString(),
          end_time: moment().add(13, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id,
          max_attendies: 15
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        yield this.apiClient.createNewRegistration(response.body.id, faker.getFakeUser()).expect(201).end();
      });

      it('return an error for non existing event', function* () {
        yield this.apiClient.createNewRegistration(0, faker.getFakeUser()).expect(404).end();
      });

    });

    describe('DELETE', function () {
      it('should delete a registation', function* () {
        const ohe = {
          start_time: moment().add(12, 'hours').toISOString(),
          end_time: moment().add(13, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id,
          max_attendies: 15
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        const registrationResponse = yield this.apiClient.createNewRegistration(response.body.id, faker.getFakeUser()).expect(201).end();
        yield this.apiClient.deleteRegistration(registrationResponse.body.id).expect(200).end();
      });

      it('should return an error for non existing registration', function* () {
        yield this.apiClient.deleteRegistration(0).expect(404).end();
      });

    });
  });
});
