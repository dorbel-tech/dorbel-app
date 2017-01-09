'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
const sinon = require('sinon');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');
const notificationService = require('../../src/services/notificationService');
const shared = require('dorbel-shared');
const fakeUser = { user_id: faker.fakeUserId };

describe('Open House Event Registration Service', function () {

  before(function () {
    this.repositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventRegistrationsRepository', this.repositoryMock);
    this.openHouseEventsFinderServiceMock = {};
    mockRequire('../../src/services/openHouseEventsFinderService', this.openHouseEventsFinderServiceMock);
    this.service = require('../../src/services/openHouseEventRegistrationsService');
    sinon.stub(shared.utils.generic, 'normalizePhone');
  });

  beforeEach(function () {
    this.sendNotification = sinon.spy(notificationService, 'send');
  });

  afterEach(function () {
    this.sendNotification.restore();
  });

  after(() => {
    mockRequire.stopAll();
  });

  describe('Register To Open House Event', function () {

    it('should register a user to an event', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent());
      this.repositoryMock.createRegistration = sinon.stub().resolves(true);

      const registrationResponse = yield this.service.register(1, fakeUser);
      __.assertThat(registrationResponse, __.is(true));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_REGISTERED));

    });

    it('should fail when the event a user wants to register does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().throws();

      let oheId = 1;

      try {
        yield this.service.register(oheId, fakeUser);
      }
      catch (error) {
        __.assertThat(error.message, __.is('Error'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail when user registers to an event more than once', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent({        
        registrations: [
          { open_house_event_id: 1, registered_user_id: faker.fakeUserId, is_active: true }
        ]
      }));

      this.repositoryMock.createRegistration = sinon.stub().resolves(true);

      try {
        yield this.service.register(1, fakeUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('user already registered to this event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail when user registers to a past event', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent({
        start_time: moment().add(-1, 'minutes')
      }));
      this.repositoryMock.createRegistration = sinon.stub().resolves(true);
      try {
        yield this.service.register(1, fakeUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('cannot register to past event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail when user registers to a past event', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent({
        registrations: [],
        start_time: moment().add(90, 'minutes')
      }));

      this.repositoryMock.createRegistration = sinon.stub().resolves(true);

      try {
        yield this.service.register(1, fakeUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('to late to register'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail when user registers an event with full capacity', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent({
        registrations: [{ open_house_event_id: 1, registered_user_id: fakeUser.user_id, is_active: true }],
        start_time: moment().add(90, 'minutes'),
        max_attendies: 1
      }));

      this.repositoryMock.createRegistration = sinon.stub().resolves(true);

      try {
        yield this.service.register(1, 2);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('event is full'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });

  describe('UnRegister an Open House Event', function () {

    it('should unregister a user from an event', function* () {
      this.repositoryMock.findRegistration = sinon.stub().resolves(faker.generateRegistration());
      this.repositoryMock.updateRegistration = sinon.stub().resolves(faker.generateRegistration({
        is_active: false
      }));

      const registrationResponse = yield this.service.unregister(1, faker.fakeUserId);
      __.assertThat(registrationResponse.is_active, __.is(false));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_UNREGISTERED));
    });

    it('should fail when the event a user tries to unregister does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(faker.generateEvent());

      try {
        yield this.service.unregister(0, faker.fakeUserId);
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });
});
