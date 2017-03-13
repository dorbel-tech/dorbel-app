'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');
const fakeUser = faker.getFakeUser();

describe('Open House Events By Listing API Integration', function () {
  let apiClient;

  before(function* () {
    this.timeout = (10000);
    apiClient = yield ApiClient.init(fakeUser);
  });

  function * getOhe(listingId, startsIn) {
    const ohe = {
      start_time: moment().add(startsIn, 'hours').toISOString(),
      end_time: moment().add(startsIn + 1, 'hours').toISOString(),
      listing_id: listingId,
      publishing_user_id: fakeUser.id,
      listing_publishing_user_id: fakeUser.id,
      max_attendies: 15
    };
    const response = yield apiClient.createNewEvent(ohe).expect(201).end();
    return response.body;
  }

  describe('/events/by-listing/', function () {
    describe('GET', function () {
      before(function * () {
        this.listingId = faker.getRandomNumber();
        this.secondListingId = faker.getRandomNumber();
        this.oheForFirstListing = yield getOhe(this.listingId, 15);
        this.laterOheForFirstListing = yield getOhe(this.listingId, 25);
        this.oheForSecondListing = yield getOhe(this.secondListingId, 20);
      });

      it('should get all events per listing id', function* () {
        const response = yield apiClient.findEventsByListing(this.listingId).expect(200).end();
        __.assertThat(response.body, __.allOf(
          __.hasSize(2),
          __.contains(
            __.hasProperty('id', this.oheForFirstListing.id),
            __.hasProperty('id', this.laterOheForFirstListing.id)
          )
        ));
      });

      it('should return an empty array given a listing id with no events', function* () {
        const response = yield apiClient.findEventsByListing(0).expect(200).end();
        __.assertThat(response.body.length, __.is(0));
      });

      it('should return events for more than one listing', function* () {
        const response = yield apiClient.findEventsByListing([ this.listingId, this.secondListingId ]).expect(200).end();
        __.assertThat(response.body, __.allOf(
          __.hasSize(3),
          __.contains( // also asserts sorted by start time
            __.hasProperty('id', this.oheForFirstListing.id),
            __.hasProperty('id', this.oheForSecondListing.id),
            __.hasProperty('id', this.laterOheForFirstListing.id)
          )
        ));
      });

      it('should filter by min-date', function* () {
        const response = yield apiClient.findEventsByListing(
          [ this.listingId, this.secondListingId ],
          { minDate: moment(this.oheForSecondListing.start_time).subtract(1, 'hour').toISOString() }
        ).expect(200).end();

        __.assertThat(response.body, __.allOf(
          __.hasSize(2),
          __.contains(
            __.hasProperty('id', this.oheForSecondListing.id),
            __.hasProperty('id', this.laterOheForFirstListing.id)
          )
        ));
      });
    });
  });
});
