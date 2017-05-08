'use strict';
const mockRequire = require('mock-require');
const _ = require('lodash');
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
      list: sinon.spy(),
      listingStatuses: [ 'pending', 'rented' ],
      update: sinon.stub().resolves(this.mockListing)
    };
    this.likeRepositoryMock = {
      getListingTotalLikes: sinon.stub().resolves(this.mockListing)
    };
    this.geoProviderMock = {
      getGeoLocation : sinon.stub().resolves(1)
    };
    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('../../src/apartmentsDb/repositories/likeRepository', this.likeRepositoryMock);
    mockRequire('../../src/providers/geoProvider', this.geoProviderMock);
    sinon.stub(shared.utils.user.management, 'updateUserDetails');
    sinon.stub(shared.utils.user.management, 'getUserDetails').resolves();
    this.listingService = require('../../src/services/listingService');
  });

  afterEach(function() {
    this.listingRepositoryMock.list.reset();
    this.listingRepositoryMock.update.reset();
    this.geoProviderMock.getGeoLocation.reset();
  });

  after(() => mockRequire.stopAll());

  describe('List Listings - getByFilter', function () {
    it('should call the repostiory', function* () {
      yield this.listingService.getByFilter();
      __.assertThat(this.listingRepositoryMock.list.called, __.is(true));
    });

    it('should send default limit and offset to the repository', function* () {
      yield this.listingService.getByFilter();
      __.assertThat(this.listingRepositoryMock.list.args[0][1], __.hasProperties({ limit: 1000, offset: 0 }));
    });

    it('should send limit and offset to the repository', function* () {
      const options = { limit: 7, offset: 6 };
      yield this.listingService.getByFilter('', options);
      __.assertThat(this.listingRepositoryMock.list.args[0][1], __.hasProperties(options));
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
        __.assertThat(error.message, __.is('הדירה שלך כבר קיימת במערכת'));
      }
    });

  });

  describe('Update Listing', function () {

    it('should update status for an existing listing', function* () {
      const listing = faker.getFakeListing();
      const user = { id: listing.publishing_user_id };
      const updatedListing = Object.assign({}, listing, { status: 'rented' });
      this.listingRepositoryMock.update = sinon.stub().resolves(updatedListing);
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      this.likeRepositoryMock.getListingTotalLikes = sinon.stub().resolves(listing.id);

      const result = yield this.listingService.update(listing.id, user, updatedListing);
      __.assertThat(result, __.hasProperties(updatedListing));
    });

    it('should throw when update status given no listing found', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(0);

      yield assertYieldedError(
        () => this.listingService.update(1, {}, { status: 'rented' }),
        __.hasProperties({
          message: 'הדירה לא נמצאה',
          status: 404
        })
      );
    });

    it('should not allow updating someone else`s listing', function* () {
      this.listingRepositoryMock.getById = sinon.stub().resolves(faker.getFakeListing());
      const user = faker.getFakeUser();

      yield assertYieldedError(
        () => this.listingService.update(1, user, { status: 'rented' }),
        __.hasProperties({
          message: 'אין באפשרותך לערוך דירה זו',
          status: 403
        })
      );
    });

    it('should allow admin to update any listing', function* () {
      const listing = faker.getFakeListing();
      const user = { role: 'admin', id: 'totally-fake' };
      const updatedListing = Object.assign({}, listing, { status: 'rented' });
      this.listingRepositoryMock.update = sinon.stub().resolves(updatedListing);
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      this.likeRepositoryMock.getListingTotalLikes = sinon.stub().resolves(listing.id);

      const result = yield this.listingService.update(listing.id, user, updatedListing);

      __.assertThat(result, __.hasProperties(updatedListing));
    });

    it('should not allow owner to update a pending listing`s status', function* () {
      const listing = Object.assign(faker.getFakeListing(), { status: 'pending' });
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      const user = { id: listing.publishing_user_id };

      yield assertYieldedError(
        () => this.listingService.update(1, user, { status : 'listed' }),
        __.hasProperties({
          message: 'אין באפשרותך לשנות את סטטוס הדירה ל listed',
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
        __.assertThat(error.message, __.is('Failed to get related listings. Listing does not exists. litingId: 0'));
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

