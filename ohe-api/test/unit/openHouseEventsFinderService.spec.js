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

      this.openHouseEventsRepositoryMock.findById = sinon.stub().resolves(existingEvent);

      let oheId = 1;

      let existingEventtResponse = yield this.service.find(oheId);
      __.assertThat(existingEvent, __.is(existingEventtResponse));
    });

    it('should fail when event id does not exists in db', function* () {
      this.openHouseEventsRepositoryMock.findById = sinon.stub().resolves(null);

      let oheId = 1;

      try {
        yield this.service.find(oheId);
        // __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('האירוע לא קיים'));
      }
    });
  });
});
