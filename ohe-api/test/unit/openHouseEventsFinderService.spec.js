'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
const faker = require('../shared/fakeObjectGenerator');
var sinon = require('sinon');

describe('Open House Event Finder Service', function () {

  before(function () {
    this.openHouseEventsRepositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
    this.service = require('../../src/services/openHouseEventsFinderService');
  });

  after(() => mockRequire.stopAll());

  describe('Find Open House Event', function () {

    it('should find an existing event', function* () {
      let existingEvent = faker.generateEvent({
        id: 1,
      });

      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(existingEvent);

      let oheId = 1;

      let existingEventtResponse = yield this.service.find(oheId);
      __.assertThat(existingEvent, __.is(existingEventtResponse));
    });

    it('should fail when event id does not exists in db', function* () {
      this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

      let oheId = 1;

      try {
        yield this.service.find(oheId);
        // __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('event does not exist'));
      }
    });
  });

  describe('Find Open House Events By Listing', function () {

    it('should return all events given a listing id', function* () {
      let existingEvents = [faker.generateEvent({
        id: 1,
        is_active: false
      })];
      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves(existingEvents);

      let existingEventsResponse = yield this.service.findByListing(1);
      __.assertThat(existingEvents, __.is(existingEventsResponse));
    });

    it('should return an empty array given a no events for listing id', function* () {
      let existingEvents = [];
      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves(existingEvents);

      let existingEventsResponse = yield this.service.findByListing(1);
      __.assertThat(existingEvents, __.is(existingEventsResponse));
    });    
  });

});
