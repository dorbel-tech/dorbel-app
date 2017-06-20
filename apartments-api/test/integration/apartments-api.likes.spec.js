'use strict';
describe('Apartments API Likes service integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const faker = require('../shared/fakeObjectGenerator');
  const utils = require('./utils');

  // Integration tests run with static ID as they fill the message queue with app-events
  const INTEGRATION_TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser({
      id: INTEGRATION_TEST_USER_ID
    }));
    yield utils.clearAllUserLikes(this.apiClient);
  });

  after(function* () {
    yield utils.clearAllUserLikes(this.apiClient);
  });

  describe('Likes service integration', function () {
    before(function* () {
      const postReponse = yield this.apiClient.createListing(faker.getFakeListing()).expect(201).end();
      this.createdApartmentId = postReponse.body.apartment_id;
      this.createdListingId = postReponse.body.id;
    });

    describe('POST /apartments/{apartmentId}/likes', function () {
      it('should set apartment as liked', function* () {
        yield this.apiClient.likeApartment(this.createdApartmentId, this.createdListingId).expect(200).end();
      });

      it('fail to set non existing apartment as liked', function* () {
        yield this.apiClient.likeApartment(0, 0).expect(404).end();
      });
    });

    describe('GET', function () {
      it('GET should get likes by listing', function* () {
        const response = yield this.apiClient.getLikesByListing(this.createdListingId).expect(200).end();
        __.assertThat(response.body.length, __.is(1));
      });
    });

    describe('GET', function () {
      it('should get likes by apartment', function* () {
        const response = yield this.apiClient.getLikesByApartment(this.createdApartmentId).expect(200).end();
        __.assertThat(response.body.length, __.is(1));
      });
    });
    describe('DELETE /apartments/{apartmentId}/likes', function () {
      it('should set apartment as unliked', function* () {
        yield this.apiClient.unlikeApartment(this.createdApartmentId, this.createdListingId).expect(200).end();
      });

      it('fail to set non existing apartment as unliked', function* () {
        yield this.apiClient.likeApartment(0, 0).expect(404).end();
      });
    });

    describe('GET /likes/user', function () {
      it('get user\'s liked apartments (user has no likes)', function* () {
        const likesResponse = yield this.apiClient.getUserLikes().expect(200).end();

        __.assertThat(likesResponse.body, __.is(__.array()));
        __.assertThat(likesResponse.body, __.hasSize(0));
      });

      it('get user\'s liked apartments (user has likes)', function* () {
        yield this.apiClient.likeApartment(this.createdApartmentId, this.createdListingId).expect(200).end();

        const likesResponse = yield this.apiClient.getUserLikes().expect(200).end();

        __.assertThat(likesResponse.body, __.is(__.array()));
        __.assertThat(likesResponse.body, __.hasSize(1));
      });

      it('get user\'s liked apartments (user has only unlikes)', function* () {
        yield this.apiClient.unlikeApartment(this.createdApartmentId, this.createdListingId).expect(200).end();
        const likesResponse = yield this.apiClient.getUserLikes().expect(200).end();

        __.assertThat(likesResponse.body, __.is(__.array()));
        __.assertThat(likesResponse.body, __.hasSize(0));
      });
    });
  });
});
