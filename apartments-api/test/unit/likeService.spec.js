'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');
var faker = require('../shared/fakeObjectGenerator');

describe('Likes Service', function () {

  before(function () {
    this.mockListing = faker.getFakeListing();
    this.likeRepositoryMock = {
      set: sinon.stub().resolves(undefined),
      getUserLikes: sinon.stub().resolves([{ listing_id: this.mockListing.id }]),
      findByListingId: sinon.stub().resolves([{ listing_id: this.mockListing.id }])
    };
    this.listingRepositoryMock = {
      getById: sinon.stub().resolves([{ listing_id: this.mockListing.id }])
    };
    process.env.NOTIFICATIONS_SNS_TOPIC_ARN = 'mocked';

    this.dorbelSharedMock = require('dorbel-shared');
    this.dorbelSharedMock.utils.messageBus.publish = sinon.spy();
    mockRequire('../../src/apartmentsDb/repositories/likeRepository', this.likeRepositoryMock);
    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('dorbel-shared', this.dorbelSharedMock);

    this.likeService = require('../../src/services/likeService');
  });

  after(() => mockRequire.stopAll());

  describe('Get user\'s likes', function () {
    it('should return an array containing the mockListing id', function* () {
      let likesResp = yield this.likeService.getUserLikes(faker.getFakeUser());
      __.assertThat(likesResp, __.is([this.mockListing.listing_id]));
    });

    it('should return an empty array because there are no likes', function* () {
      this.likeRepositoryMock.getUserLikes = sinon.stub().resolves([]);

      let likesResp = yield this.likeService.getUserLikes(faker.getFakeUser());
      __.assertThat(likesResp, __.is([]));
    });
  });

  describe('Set likes', function () {

    beforeEach(function () {
      this.sendNotification = this.dorbelSharedMock.utils.messageBus.publish = sinon.spy();
    });

    afterEach(function () {
      this.sendNotification = this.dorbelSharedMock.utils.messageBus.publish.reset();
    });

    it('Set a listing as liked', function* () {
      const user = faker.getFakeUser();

      yield this.likeService.set(1, user, true);

      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[1], __.is('LISTING_LIKED'));
    });

    it('Set a listing as unliked', function* () {
      const user = faker.getFakeUser();

      yield this.likeService.set(1, user, false);

      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[1], __.is('LISTING_UNLIKED'));
    });

    it('Should throw an error if the listing_id doesn\'t belong to an actual listing', function* () {
      const user = faker.getFakeUser();
      this.likeRepositoryMock.set = sinon.stub().throws();

      try {
        yield this.likeService.set(0, user, true);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });

  describe('Get By Listing', function () {

    it('should return active likes by listing id', function* () {
      const like = faker.getFakeLike();
      this.likeRepositoryMock.findByListingId = sinon.stub().resolves([like]);

      const result = yield this.likeService.getByListing(1);
      __.assertThat(result, __.is([like]));
    });

    it('should return empty array when no followers by listing id', function* () {
      this.likeRepositoryMock.findByListingId = sinon.stub().resolves([]);

      const result = yield this.likeService.getByListing(1);
      __.assertThat(result, __.is([]));
    });
  });
});
