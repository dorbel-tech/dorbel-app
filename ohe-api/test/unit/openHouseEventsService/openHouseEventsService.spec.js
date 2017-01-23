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
      let user = faker.getFakeUser({ id: newEvent.publishing_user_id, user_id: newEvent.publishing_user_id });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

      this.openHouseEventsRepositoryMock.create = sinon.stub().resolves(faker.generateEvent({
        id: 1,
        is_active: true
      }));

      let savedEvent = yield this.service.create(newEvent, user);
      assertSpecificProperties(newEvent, savedEvent, ['listing_id', 'start_time', 'end_time']);
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_CREATED));
    });

    it('should create a new event as admin', function* () {
      let newEvent = faker.generateEvent();
      let admin = faker.getFakeUser({ role: 'admin' });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

      this.openHouseEventsRepositoryMock.create = sinon.stub().resolves(faker.generateEvent({
        id: 1,
        is_active: true
      }));

      let savedEvent = yield this.service.create(newEvent, admin);
      assertSpecificProperties(newEvent, savedEvent, ['listing_id', 'start_time', 'end_time']);
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_CREATED));
    });

    it('should not create a new event for another user', function* () {
      let newEvent = faker.generateEvent();
      let otherUser = faker.getFakeUser();

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

      this.openHouseEventsRepositoryMock.create = sinon.stub().resolves(faker.generateEvent({
        id: 1,
        is_active: true
      }));

      try {
        yield this.service.create(newEvent, otherUser);
      }
      catch (error) {
        __.assertThat(error.message, __.is('requesting user is not the resource owner'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail when end time is less than 30 minutes after start time', function* () {
      let ohe = faker.generateEvent({
        start_time: moment().toISOString(),
        end_time: moment().add(29, 'minutes').toISOString()
      });

      let user = faker.getFakeUser({
        id: ohe.publishing_user_id,
        user_id: ohe.publishing_user_id
      });

      try {
        yield this.service.create(ohe, user);
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

      let user = faker.getFakeUser({
        id: ohe.publishing_user_id,
        user_id: ohe.publishing_user_id
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([faker.generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.service.create(ohe, user);
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

      let user = faker.getFakeUser({
        id: ohe.publishing_user_id,
        user_id: ohe.publishing_user_id
      });

      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([faker.generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.service.create(ohe, user);
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

      let user = faker.getFakeUser({
        id: ohe.publishing_user_id,
        user_id: ohe.publishing_user_id
      });


      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([faker.generateEvent({
        listing_id: 2,
        start_time: moment().add(-20, 'hours').toISOString(),
        end_time: moment().add(-10, 'hours').toISOString()
      })]);

      try {
        yield this.service.create(ohe, user);
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

    it('should remove an existing event as admin (set as not active)', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({ is_active: false });
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      let fakeAdmin = faker.getFakeUser({ role: 'admin' });

      let deleteEventResponse = yield this.service.remove(originalEvent.id, fakeAdmin);
      __.assertThat(deletedEvent, __.is(deleteEventResponse));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_DELETED));
    });

    it('should fail to remove an existing event as another user (set as not active)', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({ is_active: false });
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      try {
        yield this.service.remove(originalEvent.id, faker.getFakeUser());
      }
      catch (error) {
        __.assertThat(error.message, __.is('requesting user is not the resource owner'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should fail when deleted event id does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().throws();

      let thrown = false;

      try {
        yield this.service.remove(1, faker.getFakeUser());
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        thrown = true;
      }

      __.assertThat(thrown, __.is(true));
      __.assertThat(this.sendNotification.callCount, __.is(0));

    });
  });

  describe('Update Open House Event', function () {

    it('should update an existing event', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);

      let updatedEvent = faker.generateEvent({ max_attendies: 22 });
      let updateRequest = {
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        max_attendies: updatedEvent.max_attendies
      };

      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let fakeUser = faker.getFakeUser({
        id: originalEvent.publishing_user_id,
        user_id: originalEvent.publishing_user_id
      });

      let updateEventResponse = yield this.service.update(originalEvent.id, updateRequest, fakeUser);

      __.assertThat(updatedEvent, __.is(updateEventResponse));
    });

    it('should update an existing event as admin', function* () {
      let originalEvent = faker.generateEvent();
      let updatedEvent = faker.generateEvent({ max_attendies: 22 });
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);

      let updateRequest = {
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        max_attendies: updatedEvent.max_attendies
      };

      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let fakeAdmin = faker.getFakeUser({
        role: 'admin'
      });

      let updateEventResponse = yield this.service.update(originalEvent.id, updateRequest, fakeAdmin);

      __.assertThat(updatedEvent, __.is(updateEventResponse));
    });

    it('should update an existing event as another user', function* () {
      let originalEvent = faker.generateEvent();
      let updatedEvent = faker.generateEvent({ max_attendies: 22 });
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let updateRequest = {
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        max_attendies: updatedEvent.max_attendies
      };
      let fakeUser = faker.getFakeUser();

      try {
        yield this.service.update(originalEvent.id, updateRequest, fakeUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('requesting user is not the resource owner'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });

    it('should send notification if event time was updated', function* () {
      let originalEvent = faker.generateEvent();
      let updatedEvent = faker.generateEvent({
        start_time: moment(originalEvent.start_time).add(1, 'hour'),
        end_time: moment(originalEvent.end_time).add(1, 'hour')
      });
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);
      let updateRequest = {
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        max_attendies: updatedEvent.max_attendies
      };
      let fakeUser = faker.getFakeUser({ id: originalEvent.publishing_user_id, user_id: originalEvent.publishing_user_id });

      let updatedEventResponse = yield this.service.update(originalEvent.id, updateRequest, fakeUser);

      __.assertThat(updatedEvent, __.is(updatedEventResponse));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_UPDATED));
    });

    it('should *not* send notification if event time was *not* updated', function* () {
      let originalEvent = faker.generateEvent();
      let updatedEvent = faker.generateEvent({
        start_time: originalEvent.start_time,
        end_time: originalEvent.end_time,
        max_attendies: 25
      });
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);
      this.openHouseEventsFinderServiceMock.findByListing = sinon.stub().resolves([originalEvent]);
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(updatedEvent);

      let updateRequest = {
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        max_attendies: updatedEvent.max_attendies
      };
      let fakeUser = faker.getFakeUser({ id: updatedEvent.publishing_user_id, user_id: updatedEvent.publishing_user_id });

      yield this.service.update(updatedEvent.id, updateRequest, fakeUser);

      __.assertThat(this.sendNotification.callCount, __.is(0));
    });

    it('should fail to update if event id does not exists in db', function* () {
      this.openHouseEventsFinderServiceMock.find = sinon.stub().throws();
      let updatedEvent = faker.generateEvent();
      let thrown = false;

      try {
        yield this.service.update(updatedEvent, faker.getFakeUser());
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
