'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
const faker = require('../shared/fakeObjectGenerator');
var sinon = require('sinon');

describe('Open House Event Followers Service', function () {

  before(function () {
    this.repositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventFollowersRepository', this.repositoryMock);
    this.openHouseEventsFinderServiceMock = {};
    mockRequire('../../src/services/openHouseEventsFinderService', this.openHouseEventsFinderServiceMock);
    this.service = require('../../src/services/openHouseEventFollowersService');
  });

  after(() => mockRequire.stopAll());

  describe('Follow An Open House Event', function () {

    it('should enable a user to follow an event', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent({
        id: 1,
        is_active: true
      }));

      this.repositoryMock.createFollower = sinon.stub().resolves(true);

      const result = yield this.service.follow(1, 'user');
      __.assertThat(result, __.is(true));
    });

    it('should fail when the event a user wants to follow does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().throws();

      try {
        yield this.service.follow(1);
      }
      catch (error) {
        __.assertThat(error.message, __.is('Error'));
      }
    });

    it('should fail when user tries to follow an event more than once', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent({
        id: 1,
        is_active: true,
        followers: [
          { open_house_event_id: 1, user_id: 'user', is_active: true }
        ]
      }));

      this.repositoryMock.createFollower = sinon.stub().resolves(true);

      try {
        yield this.service.follow(1, 'user');
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('user already follows this event'));
      }
    });
  });

  describe('Unfollow An Open House Event', function () {

    it('should unfollow a user from an event', function* () {
      this.repositoryMock.findFollower = sinon.stub().resolves(faker.generateFollower());

      this.repositoryMock.updateFollower = sinon.stub().resolves(faker.generateFollower({
        is_active: false
      }));

      const result = yield this.service.unfollow(1, 'user');
      __.assertThat(result.is_active, __.is(false));
    });

    it('should fail when the event a user tries to unfollow does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(null);

      try {
        yield this.service.unfollow(1, 'user');
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
      }
    });
  });
});
