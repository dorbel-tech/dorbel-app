const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

describe('listings/validation endpoint', function () {
  before(function* () {
    const listingObj = fakeObjectGenerator.getFakeListing();
    this.apiClient = yield ApiClient.getInstance();
    this.otherApiClient = yield ApiClient.getOtherInstance();
    this.adminApiClient = yield ApiClient.getAdminInstance();
    this.apartment = listingObj.apartment;

    const createListingResp = yield this.apiClient.createListing(listingObj).expect(201).end();
    this.listing = createListingResp.body;
  });

  it('should return alreadyListed status when the user already has an active listing for the apartment (pending)', function* () {
    const validationResponse = yield this.apiClient.getValidationData(this.apartment).expect(200).end();
    __.assertThat(validationResponse.body.status, __.is('alreadyListed'));
  });

  it('should return alreadyListed status when the user already has an active listing for the apartment (listed)', function* () {
    yield this.adminApiClient.patchListing(this.listing.id, { status: 'listed' }).expect(200).end();
    const validationResponse = yield this.apiClient.getValidationData(this.apartment).expect(200).end();
    __.assertThat(validationResponse.body.status, __.is('alreadyListed'));
  });

  it('should return alreadyExists status when the user already has an *inactive* listing for the apartment', function* () {
    yield this.adminApiClient.patchListing(this.listing.id, { status: 'rented' }).expect(200).end();
    const validationResponse = yield this.apiClient.getValidationData(this.apartment).expect(200).end();
    __.assertThat(validationResponse.body.status, __.is('alreadyExists'));
  });

  it('should return belongsToOtherUser status when the *another* user already has a listing for the apartment', function* () {
    const validationResponse = yield this.otherApiClient.getValidationData(this.apartment).expect(200).end();
    __.assertThat(validationResponse.body.status, __.is('belongsToOtherUser'));
  });

  // in order to allow admin to republish another user's listing
  it('should return alreadyExists instead of belongsToOtherUser when the apartment belongs to another user and requesting user is an admin', function* () {
    const validationResponse = yield this.adminApiClient.getValidationData(this.apartment).expect(200).end();
    __.assertThat(validationResponse.body.status, __.is('alreadyExists'));
  });

  it('should return OK status when the there a no listings for the apartment', function* () {
    const validationResponse = yield this.apiClient.getValidationData(fakeObjectGenerator.getFakeListing().apartment).expect(200).end();
    __.assertThat(validationResponse.body.status, __.is('OK'));
  });
});
