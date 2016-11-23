'use strict';
describe('Apartments API Integration', function() {
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

    describe('/ohe', function() {
        describe('/get', function() {
            it('should find an open house event', function* () {
                const ohe = {
                    start_time: moment().add(-2, 'hours').toISOString(),
                    end_time: moment().add(-1, 'hours').toISOString(),
                    listing_id: getRandomNumber()
                };
                const newEventReponse = yield this.apiClient.createNewEvent(ohe).expect(201).end();
                let newEvent = newEventReponse.body;
                const existingEvent = yield this.apiClient.findEvent(newEvent.id).expect(200).end();
            });
        });

        describe('/post', function() {
            it('should create a new open house event', function* () {
                const ohe = {
                    start_time: moment().add(-2, 'hours').toISOString(),
                    end_time: moment().add(-1, 'hours').toISOString(),
                    listing_id: getRandomNumber()
                };
                const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();

            });
        });

        describe('/put', function() {
            it('should update an existing open house event', function* () {
                const ohe = {
                    start_time: moment().add(-2, 'hours').toISOString(),
                    end_time: moment().add(-1, 'hours').toISOString(),
                    listing_id: getRandomNumber()
                };
                const newEventReponse = yield this.apiClient.createNewEvent(ohe).expect(201).end();
                let newEvent = newEventReponse.body;
                newEvent.start_time = moment().add(-10, 'hours').toISOString();
                newEvent.start_time = moment().add(-9, 'hours').toISOString();
                const updatedEvent = yield this.apiClient.updateEvent(newEvent).expect(200).end();
            });
        });

        describe('/delete', function() {
            it('should delete an existing open house event', function* () {
                const ohe = {
                    start_time: moment().add(-2, 'hours').toISOString(),
                    end_time: moment().add(-1, 'hours').toISOString(),
                    listing_id: getRandomNumber()
                };
                const newEventReponse = yield this.apiClient.createNewEvent(ohe).expect(201).end();
                let newEvent = newEventReponse.body;
                const deletedEvent = yield this.apiClient.deleteEvent(newEvent.id).expect(200).end();
            });
        });
    });
});
