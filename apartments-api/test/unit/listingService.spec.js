'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');
var faker = require('../shared/fakeObjectGenerator');

describe('Listing Service', function () {

  before(function () {
    this.mockListing = { list: 'ing' };
    this.listingRepositoryMock = {
      create: sinon.stub().resolves(this.mockListing),
      getListingsForApartment: sinon.stub().resolves([])
    };
    mockRequire('../../src/apartmentDb/repositories/listingRepository', this.listingRepositoryMock);
    this.listingService = require('../../src/services/listingService');
  });

  after(() => mockRequire.stopAll());

  describe('List Listings', function () {
    it('should forward request to the repostiory', function () {
      __.assertThat(this.listingService.list, __.is(this.listingRepositoryMock.list));
    });
  });

  describe('Create Listing', function () {

    it('should return the created listing for a valid listing', function* () {
      let newListing = yield this.listingService.create(faker.getFakeListing());
      __.assertThat(newListing, __.is(this.mockListing));
    });

    it('should create a new listing without any images', function* () {
      let badListing = faker.getFakeListing();
      badListing.images = [];

      let newListing = yield this.listingService.create(badListing);
      __.assertThat(newListing, __.is(this.mockListing));
    });

    it('should not create a new listing without at least one open house event', function* () {
      let badListing = faker.getFakeListing();
      badListing.open_house_events = [];

      try {
        yield this.listingService.create(badListing);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('listing must contain at least one open house event'));
      }
    });

    it('should not create a new listing if apartment already has a non-closed listing', function* () {
      this.listingRepositoryMock.getListingsForApartment = sinon.stub().resolves([{ something: 1 }]);
      let newListing = faker.getFakeListing();
      try {
        yield this.listingService.create(newListing);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('apartment already has an active listing'));
      }
    });

  });

});
