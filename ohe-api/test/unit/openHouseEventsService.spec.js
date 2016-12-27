'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
const faker = require('../shared/fakeObjectGenerator');
const notificationService = require('../../src/services/notificationService');
var sinon = require('sinon');

describe('Open House Event Service', function () {

  before(function () {
    this.openHouseEventsRepositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
    this.openHouseEventsFinderServiceMock = {};
    mockRequire('../../src/services/openHouseEventsFinderService', this.openHouseEventsFinderServiceMock);
    this.service = require('../../src/services/openHouseEventsService');
  });

  beforeEach(function () {
    this.sendNotification = sinon.spy(notificationService, 'send');
  });

  afterEach(function () {
    this.sendNotification.restore();
  });

  after(() => mockRequire.stopAll());

  function assertSpecificProperties(original, expected, props) {
    for (var p in props) {
      __.assertThat(original[p], __.is(expected[p]));
    }
  }

  describe('Create Open House Event', function () {

    it('should create a new event', function* () {
      let newEvent = faker.generateEvent();

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

      this.openHouseEventsRepositoryMock.create = sinon.stub().resolves(faker.generateEvent({
        id: 1,
        is_active: true
      }));

      let savedEvent = yield this.service.create(newEvent);
      assertSpecificProperties(newEvent, savedEvent, ['listing_id', 'start_time', 'end_time']);
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_CREATED));
    });

    it('should fail when end time is less than 30 minutes after start time', function* () {
      let ohe = faker.generateEvent({
        start_time: moment().toISOString(),
        end_time: moment().add(29, 'minutes').toISOString()
      });

      try {
        yield this.service.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail new event is overlapping existing events (starts during an existing event)', function* () {
      let ohe = faker.generateEvent({
        start_time: moment().add(-15, 'hours').toISOString(),
        end_time: moment().add(-5, 'hours').toISOString()
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([faker.generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.service.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail new event is overlapping existing events (ends during an existing event)', function* () {
      let ohe = faker.generateEvent({
        start_time: moment().add(-25, 'hours').toISOString(),
        end_time: moment().add(-15, 'hours').toISOString()
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([faker.generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.service.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail new event is overlapping existing events (happens during an existing event)', function* () {
      let ohe = faker.generateEvent({
        start_time: moment().add(-25, 'hours').toISOString(),
        end_time: moment().add(-15, 'hours').toISOString()
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([faker.generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.service.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });

  describe('Update Open House Event', function () {

    it('should update an existing event', function* () {
      let originalEvent = faker.generateEvent({
        id: 1
      });

      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([]);

      let updatedEvent = faker.generateEvent({
        id: originalEvent.id,
        listing_id: originalEvent.listing_id,
        start_time: moment().add(-2, 'hours'),
        end_time: moment().add(-1, 'hours'),
      });

      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let savedEvent = yield this.service.update(updatedEvent);
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
        yield this.service.update(updatedEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail updated event is overlapping existing events (starts during an existing event)', function* () {
      let originalEvent = faker.generateEvent({
        start_time: moment().add(4, 'hours').toISOString(),
        end_time: moment().add(6, 'hours').toISOString()
      });

      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let overlappingEvent = faker.generateEvent({
        id: 2,
        start_time: moment().add(5, 'hours').toISOString(),
        end_time: moment().add(7, 'hours').toISOString()
      });

      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);

      try {
        yield this.service.update(overlappingEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail updated event is overlapping existing events (ends during an existing event)', function* () {
      let originalEvent = faker.generateEvent({
        start_time: moment().add(5, 'hours').toISOString(),
        end_time: moment().add(7, 'hours').toISOString()
      });

      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let overlappingEvent = faker.generateEvent({
        id: 2,
        start_time: moment().add(4, 'hours').toISOString(),
        end_time: moment().add(6, 'hours').toISOString()
      });

      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);

      try {
        yield this.service.update(overlappingEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail updated event is overlapping existing events (happens during an existing event)', function* () {
      let originalEvent = faker.generateEvent({
        id: 1,
        start_time: moment().add(-6, 'hours'),
        end_time: moment().add(-1, 'hours'),
      });

      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let anotherEvent = faker.generateEvent({
        id: 2,
        start_time: moment().add(-4, 'hours').toISOString(),
        end_time: moment().add(-2, 'hours').toISOString(),
      });

      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);

      try {
        yield this.service.update(anotherEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should exclude the updated event when checking for overlap', function* () {
      let originalEvent = faker.generateEvent({
        id: 1,
        start_time: moment().add(-6, 'hours'),
        end_time: moment().add(-2, 'hours')
      });

      let updatedEvent = faker.generateEvent({
        id: 1,
        start_time: moment().add(-5, 'hours'),
        end_time: moment().add(-2, 'hours')
      });

      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let savedEvent = yield this.service.update(updatedEvent);
      __.assertThat(savedEvent, __.is(updatedEvent));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_UPDATED));
    });
  });

  describe('Remove Open House Event', function () {

    it('should remove an existing event (set as not active)', function* () {
      let originalEvent = faker.generateEvent({
        id: 1,
        is_active: true
      });

      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({
        id: 1,
        is_active: false
      });

      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      let deleteEventResponse = yield this.service.remove(originalEvent.id);
      __.assertThat(deletedEvent, __.is(deleteEventResponse));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_DELETED));
    });

    it('should fail when deleted event id does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().throws();

      let thrown = false;

      try {
        yield this.service.remove(1);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        thrown = true;
      }

      __.assertThat(thrown, __.is(true));
      __.assertThat(this.sendNotification.callCount, __.is(0));

    });
  });
});
