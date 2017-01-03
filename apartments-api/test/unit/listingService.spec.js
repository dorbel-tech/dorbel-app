'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');
var faker = require('../shared/fakeObjectGenerator');
const shared = require('dorbel-shared');

describe('Listing Service', function () {

  before(function () {
    this.mockListing = { list: 'ing' };
    this.listingRepositoryMock = {
      create: sinon.stub().resolves(this.mockListing),
      getListingsForApartment: sinon.stub().resolves([])
    };
    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    this.listingService = require('../../src/services/listingService');
    sinon.stub(shared.utils.userManagement, 'updateUserDetails');
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

  describe('Update Listing Status', function () {
    it('should update status for an existing listing', function* () {
      const listing = faker.getFakeListing();
      const user = 'user';
      const updatedListing = Object.assign({}, listing, { status: 'rented' });

      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      this.listingRepositoryMock.updateStatus = sinon.stub().resolves(updatedListing);

      const result = yield this.listingService.updateStatus(listing.id, user, 'rented');

      __.assertThat(result, __.is(updatedListing));
    });

    it('should throw when update status given no listing found', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(undefined);

      try {
        yield this.listingService.updateStatus(1, 'rented');
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('listing "1" does not exist'));
      }
    });
  });

});
