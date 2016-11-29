'use strict';
describe('Listing Events API Integration', function () {
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

  describe('/ohe/by-listing/', function () {

    describe('/get/{id}', function () {
      it('should get all events per listing id', function* () {
        const listingId = getRandomNumber();
        const ohe1 = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: listingId
        };
        const ohe2 = {
          start_time: moment().add(-4, 'hours').toISOString(),
          end_time: moment().add(-3, 'hours').toISOString(),
          listing_id: listingId
        };
        yield this.apiClient.createNewEvent(ohe1).end();
        yield this.apiClient.createNewEvent(ohe2).expect(201).end();
        const response = yield this.apiClient.findEventsByListing(listingId).expect(200).end();
        __.assertThat(response.body.length, __.is(2));
      });

      it('should return an empty array given no events per listing id', function* () {
        const response = yield this.apiClient.findEventsByListing(9999999).expect(200).end();
        __.assertThat(response.body.length, __.is(0));
      });

    });
  });
});
