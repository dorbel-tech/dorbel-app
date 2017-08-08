'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

describe('Apartments API Documents integration', function () {
  before(function * () {
    this.apiClient = yield ApiClient.getInstance();
    this.otherApiClient = yield ApiClient.getOtherInstance();
    // delete existing documents for user
    const { body: documents } = yield this.apiClient.getDocuments().expect(200).end();
    yield documents.map(document => this.apiClient.deleteDocument(document.id).expect(204).end());
    // create listing
    const { body: createdListing } = yield this.apiClient.createListing(fakeObjectGenerator.getFakeListing()).expect(201).end();
    this.createdListing = createdListing;
  });

  it('should create a document under a listing', function * () {
    const newDoc = fakeObjectGenerator.getFakeDocument({ listing_id: this.createdListing.id });
    const { body: createdDoc } = yield this.apiClient.createDocument(newDoc).expect(201).end();

    __.assertThat(createdDoc, __.hasProperties(Object.assign({
      dorbel_user_id: this.apiClient.userProfile.id,
      listing_id: String(this.createdListing.id),
      id: __.is(__.number())
    }, newDoc)));

    this.createdDoc = createdDoc;
  });

  it('should not create a document for a listing by another user', function * () {
    yield this.otherApiClient.createDocument(fakeObjectGenerator.getFakeDocument({ listing_id: this.createdListing.id })).expect(403).end();
  });

  it('should not create a document for a non existing listing', function * () {
    yield this.apiClient.createDocument(fakeObjectGenerator.getFakeDocument({ listing_id: 99999 })).expect(404).end();
  });

  it('should not create a document with missing params', function * () {
    yield this.apiClient.createDocument(fakeObjectGenerator.getFakeDocument({ listing_id: 99999, provider_file_id: null })).expect(400).end();
  });

  it('should not create a document without listing_id', function * () {
    yield this.apiClient.createDocument(fakeObjectGenerator.getFakeDocument()).expect(400).end();
  });

  it('should get documents by listing id', function * () {
    const { body: documents } = yield this.apiClient.getDocuments({ listing_id: this.createdListing.id}).expect(200).end();
    __.assertThat(documents, __.allOf(
      __.hasSize(1),
      __.contains(__.hasProperty('id', this.createdDoc.id))
    ));
  });

  it('should not get documents for listing user doesnt own', function * () {
    yield this.otherApiClient.getDocuments({ listing_id: this.createdListing.id}).expect(403).end();
  });

  it('should get documents for user', function * () {
    const { body: documents } = yield this.apiClient.getDocuments().expect(200).end();
    __.assertThat(documents, __.allOf(
      __.hasSize(1),
      __.hasItem(__.hasProperty('id', this.createdDoc.id))
    ));
  });

  it('should delete a document', function * () {
    yield this.apiClient.deleteDocument(this.createdDoc.id).expect(204).end();
    const { body: documents } = yield this.apiClient.getDocuments().expect(200).end();
    __.assertThat(documents, __.isEmpty());
  });
});
