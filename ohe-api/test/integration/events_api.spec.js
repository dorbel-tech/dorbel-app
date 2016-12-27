'use strict';
describe('Open House Events API Integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const _ = require('lodash');
  const moment = require('moment');
  const faker = require('../shared/fakeObjectGenerator');

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  describe('/event', function () {
    describe('GET', function () {
      it('should find an open house event', function* () {
        const ohe = {
          start_time: moment().add(12, 'hours').toISOString(),
          end_time: moment().add(13, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id
        };
        const newEventReponse = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        const newEvent = newEventReponse.body;

        yield this.apiClient.createNewRegistration(newEvent.id).expect(201).end();
        yield this.apiClient.findEvent(newEvent.id).expect(200).end();
        
        const existingEventResponse = yield this.apiClient.findEvent(newEvent.id).expect(200).end();
        const existingEvent = existingEventResponse.body;
        
        __.assertThat(newEvent.id, __.is(existingEvent.id));
        __.assertThat(existingEvent.registrations.length, __.is(1));
      });

      it('should return an error for non existing event', function* () {
        yield this.apiClient.findEvent(9999999).expect(404).end();
      });

    });

    describe('POST', function () {
      it('should create a new open house event', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id
        };
        yield this.apiClient.createNewEvent(ohe).expect(201).end();

      });
    });

    describe('PUT', function () {
      it('should update an existing open house event', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id
        };
        const newEventReponse = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        let newEvent = newEventReponse.body;
        newEvent.start_time = moment().add(-10, 'hours').toISOString();
        newEvent.start_time = moment().add(-9, 'hours').toISOString();
        yield this.apiClient.updateEvent(newEvent).expect(200).end();
      });

      it('should return an error for non existing event', function* () {
        const ohe = {
          id: 9999999,
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id
        };
        yield this.apiClient.updateEvent(ohe).expect(404).end();
      });
    });

    describe('DELETE', function () {
      it('should delete an existing open house event', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id
        };
        const newEventReponse = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        let newEvent = newEventReponse.body;
        yield this.apiClient.deleteEvent(newEvent.id).expect(200).end();
      });

      it('should return an error for non existing event', function* () {
        yield this.apiClient.deleteEvent(9999999).expect(404).end();
      });
    });
  });
});
