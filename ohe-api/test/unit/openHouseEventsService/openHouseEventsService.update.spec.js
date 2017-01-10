'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
const sinon = require('sinon');

const src = '../../../src/';
const faker = require('../../shared/fakeObjectGenerator');
const notificationService = require(src + 'services/notificationService');

describe('Open House Event Service - update', function () {

  before(function () {
    mockRequire(src + 'openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock = {});
    mockRequire(src + 'services/openHouseEventsFinderService', this.openHouseEventsFinderServiceMock = {});
    mockRequire(src + 'openHouseEventsDb/repositories/openHouseEventRegistrationsRepository', this.registrationsRepository = {});
    this.service = require(src + 'services/openHouseEventsService');
  });

  beforeEach(function () {
    this.sendNotification = sinon.spy(notificationService, 'send');
  });

  afterEach(function () {
    this.sendNotification.restore();
  });

  after(() => mockRequire.stopAll());

  it('should update an existing event', function* () {
    let originalEvent = faker.generateEvent({ id: 1 });
    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([]);
    let updatedEvent = faker.generateEvent({
      id: originalEvent.id,
      listing_id: originalEvent.listing_id,
      start_time: moment().add(-2, 'hours'),
      end_time: moment().add(-1, 'hours'),
    });
    this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

    let savedEvent = yield this.service.update(originalEvent.id, updatedEvent, { id: originalEvent.publishing_user_id });
    __.assertThat(savedEvent, __.is(updatedEvent));
    __.assertThat(this.sendNotification.calledOnce, __.is(true));
    __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_UPDATED));
  });

  it('should fail when updated event id does not exists in db', function* () {
    this.openHouseEventsFinderServiceMock.find = sinon.stub().throws();

    let updatedEvent = faker.generateEvent({
      id: 1
    });

    let thrown = false;

    try {
      yield this.service.update(updatedEvent);
      __.assertThat('code', __.is('not reached'));
    }
    catch (error) {
      thrown = true;
    }
    __.assertThat(thrown, __.is(true));
    __.assertThat(this.sendNotification.callCount, __.is(0));
  });

  it('should fail when end time is less than 30 minutes after start time', function* () {
    let originalEvent = faker.generateEvent({
      id: 1
    });

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

    let updatedEvent = faker.generateEvent({
      id: 1,
      start_time: moment().toISOString(),
      end_time: moment().add(29, 'minutes').toISOString()
    });

    try {
      yield this.service.update(originalEvent.id, updatedEvent, { id: originalEvent.publishing_user_id });
      __.assertThat('code', __.is('not reached'));
    }
    catch (error) {
      __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
      __.assertThat(this.sendNotification.callCount, __.is(0));
    }
  });

  it('should fail updated event is overlapping existing events (starts during an existing event)', function* () {
    const originalEvent = faker.generateEvent();
    const otherExistingEvent = faker.generateEvent({
      id: 2,
      start_time: moment().add(4, 'hours').toDate(),
      end_time: moment().add(6, 'hours').toDate()
    });

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent, otherExistingEvent]);

    let updateRequest = {
      start_time: moment().add(5, 'hours').toISOString(),
      end_time: moment().add(7, 'hours').toISOString()
    };

    try {
      yield this.service.update(originalEvent.id, updateRequest, { id: originalEvent.publishing_user_id });
      __.assertThat('code', __.is('not reached'));
    }
    catch (error) {
      __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      __.assertThat(this.sendNotification.callCount, __.is(0));
    }
  });

  it('should fail updated event is overlapping existing events (ends during an existing event)', function* () {
    let originalEvent = faker.generateEvent();
    let otherEvent = faker.generateEvent({
      id: 2,
      start_time: moment().add(5, 'hours').toISOString(),
      end_time: moment().add(7, 'hours').toISOString()
    });

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent, otherEvent]);

    let updateRequest = {
      start_time: moment().add(4, 'hours').toISOString(),
      end_time: moment().add(6, 'hours').toISOString()
    };

    try {
      yield this.service.update(originalEvent.id, updateRequest, { id: originalEvent.publishing_user_id });
      __.assertThat('code', __.is('not reached'));
    }
    catch (error) {
      __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      __.assertThat(this.sendNotification.callCount, __.is(0));
    }
  });

  it('should fail updated event is overlapping existing events (happens during an existing event)', function* () {
    const originalEvent = faker.generateEvent();
    const anotherEvent = faker.generateEvent({
      id: 2,
      start_time: moment().add(-6, 'hours'),
      end_time: moment().add(-1, 'hours')
    });

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent, anotherEvent]);

    const updateRequest = {
      start_time: moment().add(-4, 'hours').toISOString(),
      end_time: moment().add(-2, 'hours').toISOString()
    };

    try {
      yield this.service.update(originalEvent.id, updateRequest, { id: originalEvent.publishing_user_id });
      __.assertThat('code', __.is('not reached'));
    }
    catch (error) {
      __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      __.assertThat(this.sendNotification.callCount, __.is(0));
    }
  });

  it('should exclude the updated event when checking for overlap', function* () {
    let originalEvent = faker.generateEvent({
      start_time: moment().add(-6, 'hours').toDate(),
      end_time: moment().add(-2, 'hours').toDate()
    });

    const updateRequest = {
      start_time: moment().add(-5, 'hours').toISOString(),
      end_time: moment().add(-2, 'hours').toISOString()
    };

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);
    this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(Object.assign({}, originalEvent, updateRequest));

    let savedEvent = yield this.service.update(originalEvent.id, updateRequest, { id: originalEvent.publishing_user_id });
    __.assertThat(savedEvent, __.hasProperties(updateRequest));
    __.assertThat(this.sendNotification.calledOnce, __.is(true));
    __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_UPDATED));
  });

  it('should fail when trying to update another users event', function* () {
    const originalEvent = faker.generateEvent();
    const updateRequest = { start_time: moment().add(-5, 'hours').toISOString() };
    const user = { id: 'not-the-owner-id' };
    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

    try {
      yield this.service.update(originalEvent.id, updateRequest, user);
      __.assertThat('code', __.is('not reached'));
    }
    catch (error) {
      __.assertThat(error.message, __.is('requesting user is not the resource owner'));
      __.assertThat(this.sendNotification.callCount, __.is(0));
    }
  });

  it('should clear registrations when ohe day is changed', function* () {
    const originalEvent = faker.generateEvent({
      registrations: [ faker.generateRegistration() ]
    });

    const updateRequest = { 
      start_time: moment(originalEvent.start_time).add(-2, 'days').toISOString()
    };

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.registrationsRepository.updateRegistration = sinon.stub();
    this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(Object.assign({}, originalEvent, updateRequest));

    const updatedEvent = yield this.service.update(originalEvent.id, updateRequest, { id: originalEvent.publishing_user_id });

    __.assertThat(updatedEvent, __.hasProperties({
      start_time: updateRequest.start_time,
      registrations: []
    }));
    __.assertThat(this.sendNotification.getCall(0).args, __.contains(
        notificationService.eventType.OHE_UPDATED,
        __.hasProperty('dayChanged', true)
    ));
  });

  it('should not clear registrations when only hour is changed', function* () {
    const originalEvent = faker.generateEvent({
      registrations: [ faker.generateRegistration() ]
    });

    const updateRequest = { 
      start_time: moment(originalEvent.start_time).add(-2, 'hours').toISOString()
    };

    this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
    this.registrationsRepository.updateRegistration = sinon.stub();
    this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(Object.assign({}, originalEvent, updateRequest));

    const updatedEvent = yield this.service.update(originalEvent.id, updateRequest, { id: originalEvent.publishing_user_id });

    __.assertThat(updatedEvent, __.hasProperties({
      start_time: updateRequest.start_time,
      registrations: originalEvent.registrations
    }));
    __.assertThat(this.sendNotification.getCall(0).args, __.contains(
        notificationService.eventType.OHE_UPDATED,
        __.hasProperty('dayChanged', false)
    ));
  });

});
