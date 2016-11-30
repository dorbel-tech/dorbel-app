'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
const faker = require('../shared/fakeObjectGenerator');
var sinon = require('sinon');

describe('Listing Events Service', function () {

  before(function () {
    this.openHouseEventsRepositoryMock = {};
    mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
    this.service = require('../../src/services/listingEventsService');
  });

  after(() => mockRequire.stopAll());

  describe('List Open House Events For Listing', function () {

    it('should retun all events given a listing id', function* () {
      let existingEvents = [faker.generateEvent({
        id: 1,
        is_active: false
      })];
      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves(existingEvents);

      let existingEventsResponse = yield this.service.list(1);
      __.assertThat(existingEvents, __.is(existingEventsResponse));
    });

    it('should retun an empty array given a no events for listing id', function* () {
      let existingEvents = [];
      this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves(existingEvents);

      let listingId = 1;

      let existingEventsResponse = yield this.service.list(listingId);
      __.assertThat(existingEvents, __.is(existingEventsResponse));
    });
  });
});
