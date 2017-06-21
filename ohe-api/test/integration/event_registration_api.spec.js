'use strict';
const ApiClient = require('./apiClient.js');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');
const fakeUser = faker.getFakeUser();
const today = moment().hours(0).minutes(0).seconds(0).add(1, 'days');
describe('Open House Events Registration API Integration', function () {
  before(function* () {
    this.timeout = (10000);
    this.apiClient = yield ApiClient.init(fakeUser);
  });

  describe('/event/registration', function () {

    describe('POST', function () {
      it('should create a new registation', function* () {
        const ohe = {
          start_time: today.add(3, 'hours').toISOString(),
          end_time: today.add(4, 'hours').toISOString(),
          apartment_id: faker.getRandomNumber(),
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
          apartment_id: faker.getRandomNumber(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: fakeUser.id,
          listing_publishing_user_id: fakeUser.id,
          start_time: today.add(5, 'hours').toISOString(),
          end_time: today.add(6, 'hours').toISOString(),
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
