'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');
var faker = require('../shared/fakeObjectGenerator');
const shared = require('dorbel-shared');
const assertYieldedError = require('../shared/assertYieldedError');

describe('Listing Service', function () {

  before(function () {
    this.mockListing = { list: 'ing' };
    this.listingRepositoryMock = {
      create: sinon.stub().resolves(this.mockListing),
      getListingsForApartment: sinon.stub().resolves([]),
      listingStatuses: [ 'pending', 'rented']
    };
    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('../../src/services/geoService', { setGeoLocation : l => l });
    sinon.stub(shared.utils.userManagement, 'updateUserDetails');
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
      const user = { id: listing.publishing_user_id };
      const updatedListing = Object.assign({}, listing, { status: 'rented' });
      listing.update = sinon.stub().resolves(updatedListing);
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);

      const result = yield this.listingService.updateStatus(listing.id, user, 'rented');

      __.assertThat(result, __.is(updatedListing));
    });

    it('should throw when update status given no listing found', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(undefined);

      yield assertYieldedError(
        () => this.listingService.updateStatus(1, {}, 'rented'),
        __.hasProperties({
          message: 'listing not found',
          status: 404
        })
      );
    });

    it('should not allow updating someone else`s listing', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(faker.getFakeListing());
      const user = faker.getFakeUser();
      
      yield assertYieldedError(
        () => this.listingService.updateStatus(1, user, 'rented'),
        __.hasProperties({
          message: 'unauthorized to edit this listing',
          status: 403
        })
      );      
    });

    it('should allow admin to update any listing', function* () {
      const listing = faker.getFakeListing();
      const user = { role: 'admin', id: 'totally-fake' };
      const updatedListing = Object.assign({}, listing, { status: 'rented' });
      listing.update = sinon.stub().resolves(updatedListing);
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);

      const result = yield this.listingService.updateStatus(listing.id, user, 'rented');

      __.assertThat(result, __.is(updatedListing));
    });

    it('should not allow owner to update a pending listing`s status', function* () {
      const listing = Object.assign(faker.getFakeListing(), { status: 'pending' });
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      const user = { id: listing.publishing_user_id };
    
      yield assertYieldedError(
        () => this.listingService.updateStatus(1, user, 'listed'),
        __.hasProperties({
          message: 'unauthorized to change this listing to status listed',
          status: 403
        })
      );   
    });

  });

  describe('Get related listings', function () {
    it('should return error if listing doesn\'t exist', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(undefined);

      try {
        yield this.listingService.getRelatedListings(0);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('listing "0" does not exist'));
      }
    });

    it('should get related listings of existing listing', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(faker.getFakeListing());
      this.listingRepositoryMock.list = sinon.stub().resolves([]);
      const relatedListings = yield this.listingService.getRelatedListings(1);
      __.assertThat(Array.isArray(relatedListings), __.is(true));
    });
  });
});
