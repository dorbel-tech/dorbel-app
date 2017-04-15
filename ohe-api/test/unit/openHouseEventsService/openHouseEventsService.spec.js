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
        is_active: true,
        status: 'active'
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
        is_active: true,
        status: 'active'
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
        is_active: true,
        status: 'active'
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
        __.assertThat(error.message, __.is('מינימום זמן לביקור הוא 30 דקות'));
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
        __.assertThat(error.message, __.is('כבר קיים מועד ביקור בתאריך ובשעה שבחרתם. אנא בחרו תאריך ו/או שעה אחרים'));
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
        __.assertThat(error.message, __.is('כבר קיים מועד ביקור בתאריך ובשעה שבחרתם. אנא בחרו תאריך ו/או שעה אחרים'));
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
        __.assertThat(error.message, __.is('כבר קיים מועד ביקור בתאריך ובשעה שבחרתם. אנא בחרו תאריך ו/או שעה אחרים'));
        __.assertThat(this.sendNotification.callCount, __.is(0));
      }
    });
  });

  describe('Remove Open House Event', function () {

    it('should remove an existing event (set as deleted)', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({ is_active: false, status: 'deleted' });
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      let deleteEventResponse = yield this.service.remove(originalEvent.id, { id: originalEvent.publishing_user_id });
      __.assertThat(deletedEvent, __.is(deleteEventResponse));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_DELETED));
    });

    it('should remove an existing event as admin (set as deleted)', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({ is_active: false, status: 'deleted' });
      this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

      let fakeAdmin = faker.getFakeUser({ role: 'admin' });

      let deleteEventResponse = yield this.service.remove(originalEvent.id, fakeAdmin);
      __.assertThat(deletedEvent, __.is(deleteEventResponse));
      __.assertThat(this.sendNotification.calledOnce, __.is(true));
      __.assertThat(this.sendNotification.getCall(0).args[0], __.is(notificationService.eventType.OHE_DELETED));
    });

    it('should fail to remove an existing event as another user (set as deleted)', function* () {
      let originalEvent = faker.generateEvent();
      this.openHouseEventsFinderServiceMock.find = sinon.stub().resolves(originalEvent);

      let deletedEvent = faker.generateEvent({ is_active: false, status: 'deleted' });
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
});
