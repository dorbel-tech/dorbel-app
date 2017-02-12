'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');

describe('Followers API Integration', function () {
  before(function* () {
    this.timeout = (10000);
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  describe('/follower', function () {

    describe('GET', function () {
      it('should get followers by listing', function* () {
        const followerResponse = yield this.apiClient.createNewFollower(faker.getRandomNumber(), faker.getFakeUser()).expect(201).end();
        const follower = followerResponse.body;
        const response = yield this.apiClient.getFollowersByListing(follower.listing_id).expect(200).end();
        __.assertThat(response.body.length, __.is(1));
        __.assertThat(response.body[0], __.is(follower));
      });
    });

    describe('POST', function () {
      it('should create a new follower', function* () {
        yield this.apiClient.createNewFollower(faker.getRandomNumber(), faker.getFakeUser()).expect(201).end();
      });
    });

    describe('DELETE', function () {
      it('should delete a follower', function* () {
        const ohe = {
          start_time: moment().add(-2, 'hours').toISOString(),
          end_time: moment().add(-1, 'hours').toISOString(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: faker.getFakeUser().id,
          listing_publishing_user_id: faker.getFakeUser().id,
          max_attendies: 15
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        const follower = faker.getFakeUser();
        const registrationResponse =
          yield this.apiClient.createNewFollower(response.body.id, follower).expect(201).end();
          
        yield this.apiClient.deleteFollower(registrationResponse.body.id, follower).expect(200).end();
      });

      it('should return an error for non existing follow', function* () {
        const follower = faker.getFakeUser();
        yield this.apiClient.deleteFollower(0, follower).expect(404).end();
      });

    });
  });
});
