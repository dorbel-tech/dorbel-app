'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');
var faker = require('../shared/fakeObjectGenerator');
const shared = require('dorbel-shared');
const assertYieldedError = require('../shared/assertYieldedError');

describe('Listing Service', function () {
  let assertUnauthorized = function (query) {
    return assertYieldedError(
      () => this.listingService.getByFilter(query),
      __.hasProperties({
        message: 'unauthorized for this view',
        status: 403
      })
    );
  };

  before(function () {
    this.mockUser = faker.getFakeUser();
    this.mockListing = faker.getFakeListing();
    this.listingRepositoryMock = {
      create: sinon.stub().resolves(this.mockListing),
      list: sinon.stub().resolves([]),
      listingStatuses: ['listed', 'pending', 'rented'],
      update: sinon.stub().resolves(this.mockListing),
    };
    this.likeRepositoryMock = {
      getApartmentTotalLikes: sinon.stub().resolves(this.mockListing)
    };
    this.geoProviderMock = {
      getGeoLocation: sinon.stub().resolves(1)
    };
    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('../../src/apartmentsDb/repositories/likeRepository', this.likeRepositoryMock);
    sinon.stub(shared.utils.cache, 'getHashKey').resolves(JSON.stringify(this.mockUser));
    sinon.stub(shared.utils.user.management, 'updateUserDetails');
    sinon.stub(shared.utils.user.management, 'getUserDetails').resolves();
    this.listingService = require('../../src/services/listingService');
    assertUnauthorized = assertUnauthorized.bind(this);
  });

  afterEach(function () {
    this.listingRepositoryMock.list.reset();
    this.listingRepositoryMock.list.resolves([]);
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
      __.assertThat(this.listingRepositoryMock.list.args[0][1], __.hasProperties({ limit: 15, offset: 0 }));
    });

    it('should send limit and offset to the repository', function* () {
      const options = { limit: 7, offset: 6 };
      yield this.listingService.getByFilter({}, options);
      __.assertThat(this.listingRepositoryMock.list.args[0][1], __.hasProperties(options));
    });

    it('should remove private fields from response when not in my-properties', function* () {
      const mockListings = [
        { id: 5, apartment: { apt_number: 'private', building: {} } },
        { id: 9, apartment: { building: { house_number: 'also-private' } } },
      ];
      this.listingRepositoryMock.list.resolves(mockListings);

      const response = yield this.listingService.getByFilter();

      __.assertThat(response, __.contains(
        __.allOf(
          __.hasProperty('id', 5),
          __.hasProperty('apartment', __.not(__.hasProperty('apt_number')))
        ),
        __.allOf(
          __.hasProperty('id', 9),
          __.hasProperty('apartment', __.hasProperty('buidling', __.not(__.hasProperty('house_number'))))
        )
      ));
    });

    it('should throw an error for my-properties without user object', function* () {
      yield assertUnauthorized({ myProperties: true });
    });

    it('should throw an error for my-likes without user object', function* () {
      yield assertUnauthorized({ liked: true });
    });
  });

  describe('Create Listing', function () {
    it('should return the created listing for a valid listing', function* () {
      let newListing = yield this.listingService.create(faker.getFakeListing(), this.mockUser);
      __.assertThat(newListing, __.is(this.mockListing));
    });

    it('should create a new listing for management without any images', function* () {
      let newListing = faker.getFakeListing();
      newListing.status = 'rented';
      newListing.images = [];

      newListing = yield this.listingService.create(newListing, this.mockUser);
      __.assertThat(newListing, __.is(this.mockListing));
    });

    it('should not create new listing without any images for publishing', function* () {
      let badListing = faker.getFakeListing();
      badListing.images = [];

      try {
        yield this.listingService.create(badListing, this.mockUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('לא ניתן להעלות מודעה להשכרה ללא תמונות'));
      }
    });

    it('should successfuly to create listings with different statuses', function* () {
      const statuses = [
        'listed',
        'pending',
        'rented'
      ];

      for (let i = 0; i < statuses.length; i++) {
        let newListing = faker.getFakeListing();
        newListing.status = statuses[i];
        yield this.listingService.create(newListing, this.mockUser);
      }
    });

    it('should fail to create listings with different statuses', function* () {
      const statuses = [
        'unlisted',
        'deleted',
        'random',
        undefined
      ];

      for (let i = 0; i < statuses.length; i++) {
        let newListing = faker.getFakeListing();
        newListing.status = statuses[i];
        try {
          yield this.listingService.create(newListing, this.mockUser);
          __.assertThat('code', __.is('not reached'));
        }
        catch (error) {
          __.assertThat(error.message, __.is(`לא ניתן להעלות דירה ב status ${statuses[i]}`));
        }
      }
    });

    it('should not create a new listing if apartment already has a non-closed listing', function* () {
      this.listingRepositoryMock.list = sinon.stub().resolves([{ id: 1, status: 'pending', publishing_user_id: this.mockUser.id }]);
      let newListing = faker.getFakeListing();
      try {
        yield this.listingService.create(newListing, this.mockUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('דירה זו כבר מפורסמת במערכת. לא ניתן להעלות אותה שוב.'));
      }
    });

    it('should not create a new listing if the apartment belongs to another user\'s listing', function* () {
      this.listingRepositoryMock.list = sinon.stub().resolves([{ id: 1, status: 'rented', publishing_user_id: 'someFakeUserId123' }]);
      let newListing = faker.getFakeListing();
      try {
        yield this.listingService.create(newListing, this.mockUser);
        __.assertThat('code', __.is('not reached'));
      }
      catch (error) {
        __.assertThat(error.message, __.is('דירה זו משוייכת למשתשמש אחר. אנא וודאו את הפרטים/צרו קשר עימנו לתמיכה.'));
      }
    });
  });

  describe('Update Listing', function () {

    it('should update status for an existing listing', function* () {
      const listing = faker.getFakeListing();
      listing.status = 'listed';
      const user = { id: listing.publishing_user_id };
      const updatedListing = Object.assign({}, listing, { status: 'rented' });
      this.listingRepositoryMock.update = sinon.stub().resolves(updatedListing);
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      this.likeRepositoryMock.getApartmentTotalLikes = sinon.stub().resolves(listing.apartment_id);

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
      this.likeRepositoryMock.getApartmentTotalLikes = sinon.stub().resolves(listing.apartment_id);

      const result = yield this.listingService.update(listing.id, user, updatedListing);

      __.assertThat(result, __.hasProperties(updatedListing));
    });

    it('should not allow owner to update a pending listing`s status', function* () {
      const listing = Object.assign(faker.getFakeListing(), { status: 'pending' });
      this.listingRepositoryMock.getById = sinon.stub().resolves(listing);
      const user = { id: listing.publishing_user_id };

      yield assertYieldedError(
        () => this.listingService.update(1, user, { status: 'listed' }),
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
        __.assertThat(error.message, __.is('Failed to get related listings. Listing does not exists. listingId: 0'));
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

