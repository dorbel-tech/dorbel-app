'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
const faker = require('../shared/fakeObjectGenerator');
const notificationService = require('../../src/services/notificationService');
var sinon = require('sinon');
let fakeUserId = '00000000-0000-0000-0000-000000000001';

describe('Listing Followers Service', function () {

  before(function () {
    this.repositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventFollowersRepository', this.repositoryMock);
    this.service = require('../../src/services/openHouseEventFollowersService');
  });

  beforeEach(function () {
    this.sendNotification = sinon.spy(notificationService, 'send');
  });

  afterEach(function () {
    this.sendNotification.restore();
  });

  after(() => mockRequire.stopAll());

  describe('Get By Listing', function () {

    it('should return active followers by listing id', function* () {
      const follower = faker.generateFollower();
      this.repositoryMock.findByListingId = sinon.stub().resolves([follower]);

      const result = yield this.service.getByListing(1);
      __.assertThat(result, __.is([follower]));
    });

    it('should return empty array when no followers by listing id', function* () {
      this.repositoryMock.findByListingId = sinon.stub().resolves([]);

      const result = yield this.service.getByListing(1);
      __.assertThat(result, __.is([]));
    });
  });

  describe('Follow Listing', function () {

    it('should enable a user to follow a listing given no followers for listing', function* () {
      this.repositoryMock.findByListingId = sinon.stub().resolves(null);
      this.repositoryMock.createFollower = sinon.stub().resolves(true);

      const result = yield this.service.follow(1, fakeUserId);
      __.assertThat(result, __.is(true));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_FOLLOWED);
    });

    it('should enable a user to follow a listing given listing has followers, but not this user', function* () {
      let another_user = faker.getFakeUser();
      this.repositoryMock.findByListingId = sinon.stub().resolves([{
        listing_id: 1, following_user_id: another_user.id, is_active: true
      }
      ]);

      this.repositoryMock.createFollower = sinon.stub().resolves(true);

      const result = yield this.service.follow(1, fakeUserId);
      __.assertThat(result, __.is(true));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_FOLLOWED));
    });

    it('should fail when user tries to follow an event more than once', function* () {
      this.repositoryMock.findByListingId = sinon.stub().resolves([
        { listing_id: 1, following_user_id: fakeUserId, is_active: true }
      ]);

      this.repositoryMock.createFollower = sinon.stub().resolves(true);

      try {
        yield this.service.follow(1, fakeUserId);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('user already follows this listing'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });

  describe('Unfollow An Open House Event', function () {

    it('should unfollow a user from an event', function* () {
      this.repositoryMock.findFollower = sinon.stub().resolves(faker.generateFollower());

      this.repositoryMock.updateFollower = sinon.stub().resolves(faker.generateFollower({
        is_active: false
      }));

      const result = yield this.service.unfollow(1, fakeUserId);
      __.assertThat(result.is_active, __.is(false));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_UNFOLLOWED));
    });

    it('should fail when the event a user tries to unfollow does not exists in db', function* () {
      this.repositoryMock.find = sinon.stub().resolves(null);

      try {
        yield this.service.unfollow(1, fakeUserId);
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });
});
