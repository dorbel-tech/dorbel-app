'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');
const shared = require('dorbel-shared');
const assertYieldedError = require('../shared/assertYieldedError');

describe('Listing Users Service', function () {
  const requestingUser = { id: 'same' };

  before(function () {
    this.listingUsersRepositoryMock = {
      create: sinon.stub(),
      getUsersForListing: sinon.stub(),
      getUserById: sinon.stub(),
      remove: sinon.spy()
    };
    this.listingRepositoryMock = {
      getById: sinon.stub()
    };

    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('../../src/apartmentsDb/repositories/listingUsersRepository', this.listingUsersRepositoryMock);
    sinon.stub(shared.utils.userManagement, 'getUserDetailsByEmail');
    sinon.stub(shared.utils.userManagement, 'getPublicProfile');
    this.listingUsersService = require('../../src/services/listingUsersService');
  });

  beforeEach(function() {
    this.listingRepositoryMock.getById.resolves({ publishing_user_id: requestingUser.id });
    this.listingUsersRepositoryMock.getUserById.resolves({});
  });

  afterEach(function() {
    this.listingRepositoryMock.getById.reset();
    this.listingUsersRepositoryMock.getUsersForListing.reset();
    this.listingUsersRepositoryMock.create.reset();
  });

  after(() => mockRequire.stopAll());

  function assert404(func, message) {
    return assertYieldedError(
      func,
      __.hasProperties({
        message: message || 'listing not found',
        status: 404
      })
    );
  }

  function assert403(func) {
    return assertYieldedError(
      func,
      __.hasProperties({
        message: 'requesting user is not the resource owner',
        status: 403
      })
    );
  }

  describe('create', function () {
    it('should throw error if listing doesn`t exist', function * () {
      this.listingRepositoryMock.getById.resolves(null);
      yield assert404(() => this.listingUsersService.create(1));
    });

    it('should throw error if user isn`t listing owner', function * () {
      yield  assert403(() => this.listingUsersService.create(1, {}, { id: 'bad' }));
    });

    it('should throw error if no email and no first_name', function * () {
      yield assertYieldedError(
        () => this.listingUsersService.create(1, { last_name: 'only' }, requestingUser),
        __.hasProperties({
          message: 'must include first_name for non-registered user',
          status: 400
        })
      );
    });

    it('should create tenant as existing user by email', function * () {
      const user_uuid = 'asdfjlkjesafdsdfad';
      const first_name = 'Dudu';
      const email = 'Dudu1952@parpar.nehmad.co.il';
      const listing_id = 1;
      const existingUser = {
        email,
        user_metadata: { first_name },
        app_metadata: { dorbel_user_id: user_uuid }
      };
      shared.utils.userManagement.getUserDetailsByEmail.resolves(existingUser);

      yield this.listingUsersService.create(listing_id, { email }, requestingUser);

      __.assertThat(this.listingUsersRepositoryMock.create.args[0][0], __.hasProperties({
        listing_id, user_uuid, email, first_name
      }));
    });

    it('should create guest user with details from request', function * () {
      shared.utils.userManagement.getUserDetailsByEmail.resolves(null);
      const userToCreate = {
        first_name: 'Pingi',
        last_name: 'Cohen'
      };

      yield this.listingUsersService.create(1, userToCreate, requestingUser);

      __.assertThat(this.listingUsersRepositoryMock.create.args[0][0], __.hasProperties(userToCreate));
    });

    it('should return the created object', function * () {
      const createdUser = { abc: 123 };
      this.listingUsersRepositoryMock.create.resolves(createdUser);

      const response = yield this.listingUsersService.create(1, { first_name: 'bla' }, requestingUser);

      __.assertThat(response, __.is(createdUser));
    });
  });

  describe('get', function () {
    it('should throw error if listing doesn`t exist', function * () {
      this.listingRepositoryMock.getById.resolves(null);
      yield assert404(() => this.listingUsersService.get(1));
    });

    it('should throw error if user isn`t listing owner', function * () {
      yield assert403(() => this.listingUsersService.get(1, { id: 'no' }));
    });

    it('should return auth0 public profile for registered user', function * () {
      const registeredUser = { id: 7, user_uuid: 123 };
      const publicProfile = { public: 'profile' };
      this.listingUsersRepositoryMock.getUsersForListing.resolves([ registeredUser ]);
      shared.utils.userManagement.getPublicProfile.resolves(publicProfile);

      const users = yield this.listingUsersService.get(1, requestingUser);

      __.assertThat(users, __.hasSize(1));
      __.assertThat(users[0], __.hasProperties({
        id: registeredUser.id,
        public: publicProfile.public
      }));
    });

    it('should return guest user profile', function * () {
      const guestUser = { id: 42, email: 'bla', first_name: 'shoes' };
      this.listingUsersRepositoryMock.getUsersForListing.resolves([ guestUser ]);

      const users = yield this.listingUsersService.get(1, requestingUser);

      __.assertThat(users, __.hasSize(1));
      __.assertThat(users[0], __.hasProperties(guestUser));
    });
  });

  describe('remove', function () {
    it('should throw error if listing user doesn`t exist', function * () {
      this.listingUsersRepositoryMock.getUserById.resolves(null);
      yield assert404(() => this.listingUsersService.remove(1), 'listing user not found');
    });

    it('should throw error if user isn`t listing owner', function * () {
      yield assert403(() => this.listingUsersService.remove(1, { id: 'shoe' }));
    });

    it('should call remove with listing user id', function * () {
      const id = 123123;
      yield this.listingUsersService.remove(id, requestingUser);
      __.assertThat(this.listingUsersRepositoryMock.remove.args[0][0], __.is(id));
    });
  });
});
