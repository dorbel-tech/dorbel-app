'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const _ = require('lodash');
const __ = require('hamjest');
var sinon = require('sinon');

describe('Open House Event Service', function () {

  before(function () {
    this.openHouseEventsRepositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
    this.openHouseEventsService = require('../../src/services/openHouseEventsService');
  });

  after(() => mockRequire.stopAll());

  function generateEvent(variant) {
    return _.extend({
      listing_id: 1,
      start_time: moment().add(-5, 'hours'),
      end_time: moment().add(-3, 'hours'),
    }, variant);
  }

  function assertSpecificProperties(original, expected, props) {
    for (var p in props) {
      __.assertThat(original[p], __.is(expected[p]));
    }
  }

  describe('Find Open House Event', function () {

    it('should find an existing event', function* () {
      let existingEvent = generateEvent({
        id: 1,
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(existingEvent);

      let oheId = 1;

      let existingEventtResponse = yield this.openHouseEventsService.find(oheId);
      __.assertThat(existingEvent, __.is(existingEventtResponse));
    });

    it('should fail when event id does not exists in db', function* () {
      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

      let oheId = 1;

      try {
        yield this.openHouseEventsService.find(oheId);
        // __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
      }
    });
  });

  describe('Create Open House Event', function () {

    it('should create a new event', function* () {
      let newEvent = generateEvent();

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

      this.openHouseEventsRepositoryMock.create = sinon.stub().resolves(generateEvent({
        id: 1,
        is_active: true
      }));

      let savedEvent = yield this.openHouseEventsService.create(newEvent);
      assertSpecificProperties(newEvent, savedEvent, ['listing_id', 'start_time', 'end_time']);
    });

    it('should fail when end time is less than 30 minutes after start time', function* () {
      let ohe = generateEvent({
        start_time: moment().toISOString(),
        end_time: moment().add(29, 'minutes').toISOString()
      });

      try {
        yield this.openHouseEventsService.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
      }
    });

    it('should fail new event is overlapping existing events (starts during an existing event)', function* () {
      let ohe = generateEvent({
        start_time: moment().add(-15, 'hours').toISOString(),
        end_time: moment().add(-5, 'hours').toISOString()
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.openHouseEventsService.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      }
    });

    it('should fail new event is overlapping existing events (ends during an existing event)', function* () {
      let ohe = generateEvent({
        start_time: moment().add(-25, 'hours').toISOString(),
        end_time: moment().add(-15, 'hours').toISOString()
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.openHouseEventsService.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      }
    });

    it('should fail new event is overlapping existing events (happens during an existing event)', function* () {
      let ohe = generateEvent({
        start_time: moment().add(-25, 'hours').toISOString(),
        end_time: moment().add(-15, 'hours').toISOString()
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.openHouseEventsService.create(ohe);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      }
    });
  });

  describe('Update Open House Event', function () {

    it('should update an existing event', function* () {
      let originalEvent = generateEvent({
        id: 1
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

      let updatedEvent = generateEvent({
        id: originalEvent.id,
        listing_id: originalEvent.listing_id,
        start_time: moment().add(-2, 'hours'),
        end_time: moment().add(-1, 'hours'),
      });

      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let savedEvent = yield this.openHouseEventsService.update(updatedEvent);
      __.assertThat(savedEvent, __.is(updatedEvent));
    });

    it('should fail when updated event id does not exists in db', function* () {
      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

      let updatedEvent = generateEvent({
        id: 1
      });

      try {
        yield this.openHouseEventsService.update(updatedEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
      }
    });

    it('should fail when end time is less than 30 minutes after start time', function* () {
      let originalEvent = generateEvent({
        id: 1
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);

      let updatedEvent = generateEvent({
        id: 1,
        start_time: moment().toISOString(),
        end_time: moment().add(29, 'minutes').toISOString()
      });

      try {
        yield this.openHouseEventsService.update(updatedEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
      }
    });

    it('should fail updated event is overlapping existing events (starts during an existing event)', function* () {
      let originalEvent = generateEvent({
        id: 1
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);

      let anotherEvent = generateEvent({
        id: 2,
        start_time: moment().add(-6, 'hours').toISOString(),
        end_time: moment().add(-4, 'hours').toISOString(),
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([originalEvent]);

      try {
        yield this.openHouseEventsService.update(anotherEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      }
    });

    it('should fail updated event is overlapping existing events (ends during an existing event)', function* () {
      let originalEvent = generateEvent({
        id: 1
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);

      let anotherEvent = generateEvent({
        id: 2,
        start_time: moment().add(-4, 'hours').toISOString(),
        end_time: moment().add(-2, 'hours').toISOString(),
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([originalEvent]);

      try {
        yield this.openHouseEventsService.update(anotherEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      }
    });

    it('should fail updated event is overlapping existing events (happens during an existing event)', function* () {
      let originalEvent = generateEvent({
        id: 1,
        start_time: moment().add(-6, 'hours'),
        end_time: moment().add(-1, 'hours'),
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);

      let anotherEvent = generateEvent({
        id: 2,
        start_time: moment().add(-4, 'hours').toISOString(),
        end_time: moment().add(-2, 'hours').toISOString(),
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([originalEvent]);

      try {
        yield this.openHouseEventsService.update(anotherEvent);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('new event is overlapping an existing event'));
      }
    });

    it('should exclude the updated event when checking for overlap', function* () {
      let originalEvent = generateEvent({
        id: 1,
        start_time: moment().add(-6, 'hours'),
        end_time: moment().add(-2, 'hours')
      });

      let updatedEvent = generateEvent({
        id: 1,
        start_time: moment().add(-5, 'hours'),
        end_time: moment().add(-2, 'hours')
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([originalEvent]);
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);
      
      let savedEvent = yield this.openHouseEventsService.update(updatedEvent);
      __.assertThat(savedEvent, __.is(updatedEvent));
    });
  });

  describe('Remove Open House Event', function () {

    it('should remove an existing event (set as not active)', function* () {
      let originalEvent = generateEvent({
        id: 1,
        is_active: true
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = generateEvent({
        id: 1,
        is_active: false
      });

      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      let deleteEventResponse = yield this.openHouseEventsService.remove(originalEvent.id);
      __.assertThat(deletedEvent, __.is(deleteEventResponse));
    });

    it('should fail when deleted event id does not exists in db', function* () {
      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

      try {
        yield this.openHouseEventsService.remove(1);
        // __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
      }
    });
  });
});
