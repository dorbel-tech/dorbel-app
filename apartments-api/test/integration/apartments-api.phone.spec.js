'use strict';

describe('Apartments API - Expose publisher phone integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

  before(function* () {
    this.apiClient = yield ApiClient.getInstance();

    // Create listing with show_phone = true
    const newListingWithPhoneObj = fakeObjectGenerator.getFakeListing();
    newListingWithPhoneObj.show_phone = true;
    const listingWithPhoneResp = yield this.apiClient.createListing(newListingWithPhoneObj).expect(201).end();
    this.listingWithPhone = listingWithPhoneResp.body;

    // Create listing with show_phone = false
    const newListingWithoutPhoneObj = fakeObjectGenerator.getFakeListing();
    const listingWithoutPhoneResp = yield this.apiClient.createListing(newListingWithoutPhoneObj).expect(201).end();
    this.listingWithoutPhone = listingWithoutPhoneResp.body;

    // Repeated alot across tests, should find a better way when possible
    const adminApiClient = yield ApiClient.getAdminInstance();
    yield adminApiClient.patchListing(this.listingWithPhone.id, { status: 'listed' }).expect(200).end();
    yield adminApiClient.patchListing(this.listingWithoutPhone.id, { status: 'listed' }).expect(200).end();

  });

  describe('Listing with visible phone', function () {
    function __assertPhoneVisibleResp(resp, shouldReturnPhone) {
      __.assertThat(resp.body, __.hasProperty('show_phone', true));

      if (shouldReturnPhone) {
        __.assertThat(resp.body, __.hasProperty('publishing_user_phone'));
      }
      else {
        __.assertThat(resp.body, __.not(__.hasProperty('publishing_user_phone')));
      }
    }

    it('should return phone to authenticated user', function* () {
      const resp = yield this.apiClient.getSingleListing(this.listingWithPhone.id, true).expect(200).end();

      __assertPhoneVisibleResp(resp, true);
    });

    it('should not return phone to anonymous user', function* () {
      const resp = yield this.apiClient.getSingleListing(this.listingWithPhone.id).expect(200).end();

      __assertPhoneVisibleResp(resp);
    });
  });

  describe('Listing without visible phone', function () {
    function __assertNoPhoneResp(resp) {
      __.assertThat(resp.body, __.hasProperty('show_phone', false));
      __.assertThat(resp.body, __.not(__.hasProperty('publishing_user_phone')));
    }

    it('should return phone to authenticated user', function* () {
      const resp = yield this.apiClient.getSingleListing(this.listingWithoutPhone.id, true).expect(200).end();

      __assertNoPhoneResp(resp);
    });

    it('should not return phone to anonymous user', function* () {
      const resp = yield this.apiClient.getSingleListing(this.listingWithoutPhone.id).expect(200).end();

      __assertNoPhoneResp(resp);
    });
  });
});
