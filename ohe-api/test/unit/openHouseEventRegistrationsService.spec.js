'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');

describe('Open House Event Registration Service', function () {

  before(function () {
    this.repositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventRegistrationsRepository', this.repositoryMock);
    this.openHouseEventsServiceMock = {};
    mockRequire('../../src/services/openHouseEventsService', this.openHouseEventsServiceMock);
    this.service = require('../../src/services/openHouseEventRegistrationsService');
  });

  after(() => mockRequire.stopAll());

  describe('Register To Open House Event', function () {

    it('should register a user to an event', function* () {
      this.openHouseEventsServiceMock.find = sinon.stub().resolves({
        id: 1,
        listing_id: 1,
        start_time: moment().add(-4, 'hours'),
        end_time: moment().add(-3, 'hours'),
        is_active: true
      });

      this.repositoryMock.createRegistration = sinon.stub().resolves(true);

      const oheId = 1;
      const userId = 'user';

      const registrationResponse = yield this.service.register(oheId, userId);
      __.assertThat(registrationResponse, __.is(true));
    });

    it('should fail when the event a user registers does not exists in db', function* () {
      this.openHouseEventsServiceMock.find = sinon.stub().throws();

      let oheId = 1;

      try {
        yield this.service.register(oheId);
      }
      catch (error) {
        __.assertThat(error.message, __.is('Error'));
      }
    });

    it('should fail when user registers to an event more than once', function* () {
      this.openHouseEventsServiceMock.find = sinon.stub().resolves({
        id: 1,
        listing_id: 1,
        start_time: moment().add(-4, 'hours'),
        end_time: moment().add(-3, 'hours'),
        is_active: true,
        registrations: [
          { open_house_event_id: 1, user_id: 'user', is_active: true }
        ]
      });

      this.repositoryMock.createRegistration = sinon.stub().resolves(true);

      const oheId = 1;
      const userId = 'user';

      try {
        yield this.service.register(oheId, userId);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('user already registered to this event'));
      }
    });
  });

  describe('UnRegister an Open House Event', function () {

    it('should unregister a user from an event', function* () {
      this.repositoryMock.findRegistration = sinon.stub().resolves({
        id: 1,
        eventId: 1,
        userId: 'user',
        is_active: true
      });

      this.repositoryMock.updateRegistration = sinon.stub().resolves({
        id: 1,
        eventId: 1,
        userId: 'user',
        is_active: false
      });

      const oheId = 1;
      const userId = 'user';

      const registrationResponse = yield this.service.unregister(oheId, userId);
      __.assertThat(registrationResponse.is_active, __.is(false));
    });

    it('should fail when the event a user unregisters does not exists in db', function* () {
      this.openHouseEventsServiceMock.find = sinon.stub().resolves(null);

      let oheId = 1;

      try {
        yield this.service.unregister(oheId);
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
      }
    });
  });
});
