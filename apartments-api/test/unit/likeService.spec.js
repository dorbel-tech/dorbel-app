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
      isLiked: sinon.stub().resolves(true),
      getUserLikes: sinon.stub().resolves([{ listing_id: this.mockListing.id }])
    };

    this.dorbelSharedMock = require('dorbel-shared');
    this.dorbelSharedMock.utils.messageBus.publish = sinon.spy();
    mockRequire('../../src/apartmentsDb/repositories/likeRepository', this.likeRepositoryMock);
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
        __.assertThat(error.message, __.is('Could not like listing'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });
});
