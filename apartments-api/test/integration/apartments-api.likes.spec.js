'use strict';
describe('Apartments API Likes service integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const faker = require('../shared/fakeObjectGenerator');

  // Integration tests run with static ID as they fill the message queue with app-events
  const INTEGRATION_TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser({
      id: INTEGRATION_TEST_USER_ID
    }));
  });

  describe('Likes service integration', function () {
    before(function* () {
      const postReponse = yield this.apiClient.createListing(faker.getFakeListing()).expect(201).end();
      this.createdListingId = postReponse.body.id;
    });

    describe('POST /likes/{listingId}', function () {
      it('should set listing as liked', function* () {
        yield this.apiClient.likeListing(this.createdListingId).expect(200).end();
      });

      it('fail to set non existing listing as liked', function* () {
        // TODO: fix so that the response will be 404
        yield this.apiClient.likeListing(0).expect(500).end();
      });
    });

    describe('DELETE /likes/{listingId}', function () {
      it('should set listing as unliked', function* () {
        yield this.apiClient.unlikeListing(this.createdListingId).expect(200).end();
      });

      it('fail to set non existing listing as unliked', function* () {
        yield this.apiClient.likeListing(0).expect(500).end();
      });
    });

    describe('GET /likes/user', function () {
      it('get user\'s liked listings (user has no likes)', function* () {
        const likesResponse = yield this.apiClient.getUserLikes().expect(200).end();

        __.assertThat(likesResponse.body, __.is(__.array()));
        __.assertThat(likesResponse.body, __.hasSize(0));
      });

      it('get user\'s liked listings (user has likes)', function* () {
        yield this.apiClient.likeListing(this.createdListingId).expect(200).end();
        
        const likesResponse = yield this.apiClient.getUserLikes(this.createdListingId).expect(200).end();

        __.assertThat(likesResponse.body, __.is(__.array()));
        __.assertThat(likesResponse.body, __.hasSize(1));
      });

      it('get user\'s liked listings (user has only unlikes)', function* () {
        yield this.apiClient.unlikeListing(this.createdListingId).expect(200).end();

        const likesResponse = yield this.apiClient.getUserLikes(this.createdListingId).expect(200).end();

        __.assertThat(likesResponse.body, __.is(__.array()));
        __.assertThat(likesResponse.body, __.hasSize(0));
      });
    });
  });
});
