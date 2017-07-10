'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
const sinon = require('sinon');
const assertYieldedError = require('../shared/assertYieldedError');

describe('Documents Service', function () {
  
  before(function () {
    this.sinon = sinon.sandbox.create();
    this.documentRepositoryMock = {
      create: this.sinon.stub(),
      find: this.sinon.stub(),
      findById: this.sinon.stub(),
      destroy: this.sinon.stub()
    };
    this.listingRepositoryMock = {
      getById: this.sinon.stub()
    };

    mockRequire('../../src/apartmentsDb/repositories/documentRepository', this.documentRepositoryMock);
    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    this.documentService = mockRequire.reRequire('../../src/services/documentService');
  });

  afterEach(function () {
    this.sinon.reset();
  });

  describe('create document', function () {
    it('should not create a document for a non-existing listing', function * () {
      this.listingRepositoryMock.getById.resolves(undefined);

      yield assertYieldedError(
        () => this.documentService.create({}),
        __.hasProperty('status', 404)
      );
    });

    it('should not create a document by an unpriviliged user', function * () {      
      this.listingRepositoryMock.getById.resolves({ publishing_user_id: 123 });
      yield assertYieldedError(
        () => this.documentService.create({}, { id: 456 }),
        __.hasProperty('status', 403)
      );
    });

    it('should send valid document to document repository', function * () {
      const mockDocument = { filename: 'file' };
      const mockUser = { id: 123 };
      const mockListing = { publishing_user_id: mockUser.id };
      this.listingRepositoryMock.getById.resolves(mockListing);
      yield this.documentService.create(mockDocument, mockUser);
      __.assertThat(this.documentRepositoryMock.create.args[0][0], __.is(mockDocument));
    });

    it('should return newly created document from repository', function * () {
      const mockUser = { id: 123 };
      const mockListing = { publishing_user_id: mockUser.id };
      const newDoc = { bla: 'bla' };
      this.listingRepositoryMock.getById.resolves(mockListing);
      this.documentRepositoryMock.create.resolves(newDoc);

      const newlyCreatedDocument = yield this.documentService.create({}, mockUser);

      __.assertThat(newlyCreatedDocument, __.is(newDoc));
    });

    it('should use listing publisher as document owner when admin creates document', function * () {
      const mockUser = { id: 123, role: 'admin' };
      const mockListing = { publishing_user_id: 456 };
      this.listingRepositoryMock.getById.resolves(mockListing);
      
      yield this.documentService.create({}, mockUser);

      __.assertThat(this.documentRepositoryMock.create.args[0][0], __.hasProperty('dorbel_user_id', mockListing.publishing_user_id));
    });    
  });

  describe('get by listing id', function () {
    it('should return 404 if listing does not exist', function * () {
      this.listingRepositoryMock.getById.resolves(undefined);

      yield assertYieldedError(
        () => this.documentService.getByListingId(123),
        __.hasProperty('status', 404)
      );
    });

    it('should return 403 for an unpriviliged user', function * () {      
      this.listingRepositoryMock.getById.resolves({ publishing_user_id: 123 });
      yield assertYieldedError(
        () => this.documentService.getByListingId({}, { id: 456 }),
        __.hasProperty('status', 403)
      );
    });

    it('should send id to repository and return documents', function * () {
      const listing_id = 789;
      const mockDocuments = [];
      this.listingRepositoryMock.getById.resolves({ publishing_user_id: 123 });
      this.documentRepositoryMock.find.resolves(mockDocuments);

      const foundDocuments = yield this.documentService.getByListingId(listing_id, { id: 123 });

      __.assertThat(foundDocuments, __.is(mockDocuments));
      __.assertThat(this.documentRepositoryMock.find.args[0][0], __.hasProperties({ listing_id }));
    });
  });

  describe('get by user', function () {
    it('should send user id to repository and return documents', function * () {
      const dorbel_user_id = '129asdjflakjnf93';
      const mockDocuments = [];
      this.documentRepositoryMock.find.resolves(mockDocuments);

      const foundDocuments = yield this.documentService.getByUser({ id: dorbel_user_id });

      __.assertThat(foundDocuments, __.is(mockDocuments));
      __.assertThat(this.documentRepositoryMock.find.args[0][0], __.hasProperties({ dorbel_user_id }));
    });
  });

  describe('destroy document', function () {
    it('should return 404 if document does not exist', function * () {
      this.documentRepositoryMock.findById.resolves(undefined);

      yield assertYieldedError(
        () => this.documentService.destroy(123),
        __.hasProperty('status', 404)
      );
    });

    it('should return 403 for an unpriviliged user', function * () {      
      this.documentRepositoryMock.findById.resolves({ dorbel_user_id: 123 });
      yield assertYieldedError(
        () => this.documentService.destroy(789, { id: 456 }),
        __.hasProperty('status', 403)
      );
    });

    it('should send id to destroy to repository', function * () {
      this.documentRepositoryMock.findById.resolves({ dorbel_user_id: 123 });
      const document_id = 1230198;

      yield this.documentService.destroy(document_id, { id: 123 }),

      __.assertThat(this.documentRepositoryMock.destroy.args[0][0], __.is(document_id));
    });
  });
});
