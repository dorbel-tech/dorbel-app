'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');
const fakeUser = faker.getFakeUser();
const today = moment().hours(0).minutes(0).seconds(0).add(1, 'days');

describe('Followers API Integration', function () {
  before(function* () {
    this.timeout = (10000);
    this.apiClient = yield ApiClient.init(fakeUser);
  });

  describe('/follower', function () {

    describe('GET', function () {
      it('should get followers by listing', function* () {
        const followerResponse = yield this.apiClient.createNewFollower(faker.getRandomNumber(), fakeUser).expect(201).end();
        const follower = followerResponse.body;
        const response = yield this.apiClient.getFollowersByListing(follower.listing_id).expect(200).end();
        __.assertThat(response.body.length, __.is(1));
        __.assertThat(response.body[0], __.is(follower));
      });
    });

    describe('POST', function () {
      it('should create a new follower', function* () {
        yield this.apiClient.createNewFollower(faker.getRandomNumber(), fakeUser).expect(201).end();
      });
    });

    describe('DELETE', function () {
      it('should delete a follower', function* () {
        const ohe = {
          start_time: today.add(1, 'hours').toISOString(),
          end_time: today.add(2, 'hours').toISOString(),
          apartment_id: faker.getRandomNumber(),
          listing_id: faker.getRandomNumber(),
          publishing_user_id: fakeUser.id,
          listing_publishing_user_id: fakeUser.id,
          max_attendies: 15
        };
        const response = yield this.apiClient.createNewEvent(ohe).expect(201).end();
        const follower = fakeUser;
        const registrationResponse =
          yield this.apiClient.createNewFollower(response.body.id, follower).expect(201).end();

        yield this.apiClient.deleteFollower(registrationResponse.body.id, follower).expect(200).end();
      });

      it('should return an error for non existing follow', function* () {
        const follower = fakeUser;
        yield this.apiClient.deleteFollower(0, follower).expect(404).end();
      });

    });
  });
});
