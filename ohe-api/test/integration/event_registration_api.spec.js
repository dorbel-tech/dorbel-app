'use strict';
const ApiClient = require('./apiClient.js');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');
const fakeUser = faker.getFakeUser();

describe('Open House Events Registration API Integration', function () {
  before(function* () {
    this.timeout = (10000);
    this.apiClient = yield ApiClient.init(fakeUser);
  });

  describe('/event/registration', function () {

    describe('POST', function () {
      it('should create a new registation', function* () {
        const ohe = {
          start_time: moment().add(12, 'hours').toISOString(),
          end_time: moment().add(13, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: fakeUser.id,
          listing_publishing_user_id: fakeUser.id,          
          max_attendies: 15
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        yield this.apiClient.createNewRegistration(response.body.id, fakeUser).expect(201).end();
      });

      it('return an error for non existing event', function* () {
        yield this.apiClient.createNewRegistration(0, fakeUser).expect(404).end();
      });

    });

    describe('DELETE', function () {
      it('should delete a registation', function* () {
        const ohe = {
          start_time: moment().add(12, 'hours').toISOString(),
          end_time: moment().add(13, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: fakeUser.id,
          listing_publishing_user_id: fakeUser.id,
          max_attendies: 15
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        yield this.apiClient.createNewRegistration(response.body.id, fakeUser).expect(201).end();
        yield this.apiClient.deleteRegistration(response.body.id).expect(200).end();
      });

      it('should return an error for non existing registration', function* () {
        yield this.apiClient.deleteRegistration(0).expect(404).end();
      });

    });
  });
});
