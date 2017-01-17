'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
const sinon = require('sinon');
const src = '../../../src/';
const faker = require('../../shared/fakeObjectGenerator');
const notificationService = require(src + 'services/notificationService');

describe('Open House Event Service', function () {

  before(function () {
    this.openHouseEventsRepositoryMock = {};
    mockRequire(src + 'openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
    this.openHouseEventsFinderServiceMock = {};
    mockRequire(src + 'services/openHouseEventsFinderService', this.openHouseEventsFinderServiceMock);
    this.service = require(src + 'services/openHouseEventsService');
  });

  beforeEach(function () {
    this.sendNotification = sinon.spy(notificationService, 'send');
  });

  afterEach(function () {
    this.sendNotification.restore();
  });

  after(() => {
    mockRequire.stopAll();
    delete require.cache[require.resolve(src + 'services/openHouseEventsService')];
  });

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

  describe('Remove Open House Event', function () {

    it('should remove an existing event (set as not active)', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({ is_active: false });
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      let deleteEventResponse = yield this.service.remove(originalEvent.id, { id: originalEvent.publishing_user_id });
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
