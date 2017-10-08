'use strict';
const __ = require('hamjest');
const moment = require('moment');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');
const utils = require('./utils');
const _ = require('lodash');
const ApiClient = require('./apiClient.js');

describe('GET /listings', function () {
  let apartmentIdWithTwoListings;

  before(function* () {
    this.apiClient = yield ApiClient.getInstance();
    this.adminApiClient = yield ApiClient.getAdminInstance();
  });

  it('should get listings', function* () {
    const getResponse = yield this.apiClient.getListings().expect(200).end();
    __.assertThat(getResponse.body, __.is(__.array()));
  });

  it('should limit and offset', function* () {
    const firstRepsponse = yield this.apiClient.getListings({ limit: 1 }).expect(200).end();
    const secondResponse = yield this.apiClient.getListings({ limit: 1, offset: 1 }).expect(200).end();
    __.assertThat(firstRepsponse.body, __.hasSize(1));
    __.assertThat(secondResponse.body, __.hasSize(1));
    __.assertThat(firstRepsponse.body[0].id, __.is(__.not(secondResponse.body[0].id)));
  });

  it('should return only liked listings where liked: true', function* () {
    yield utils.clearAllUserLikes(this.apiClient);

    const prepGetListingResponse = yield this.apiClient.getListings({ limit: 2 }).expect(200).end();
    yield this.apiClient.likeApartment(prepGetListingResponse.body[1].apartment_id, prepGetListingResponse.body[1].id).expect(200).end();

    const getListingResponse = yield this.apiClient.getListings({ q: { liked: true } }, true).expect(200).end();

    __.assertThat(getListingResponse.body, __.is(__.array()));
    __.assertThat(getListingResponse.body, __.hasSize(1));
    __.assertThat(getListingResponse.body[0].id, __.is(prepGetListingResponse.body[1].id));

    yield utils.clearAllUserLikes(this.apiClient);
  });

  it('should return error when requesting my likes and not authenticated', function* () {
    yield this.apiClient.getListings({ q: { liked: true } }, false).expect(403).end();
  });

  it('should return only the last listing for an apartment with multiple listings', function* () {
    // Create 2 lisitngs for the same apartment, set the first to rented and the second to listed
    const firstListing = fakeObjectGenerator.getFakeListing();
    const firstListingResp = yield this.apiClient.createListing(firstListing).expect(201).end();

    yield this.adminApiClient.patchListing(firstListingResp.body.id, { status: 'rented' }).expect(200).end();

    let secondListing = _.cloneDeep(firstListing);
    secondListing.lease_start = fakeObjectGenerator.getDateString(moment().add(1, 'months'));
    secondListing.lease_end = fakeObjectGenerator.getDateString(moment().add(1, 'months'));
    const secondListingResp = yield this.apiClient.createListing(secondListing).expect(201).end();
    yield this.adminApiClient.patchListing(secondListingResp.body.id, { status: 'listed' }).expect(200).end();

    const getResponse = yield this.apiClient.getListings().expect(200).end();

    const listingsForSameApartment = getResponse.body.filter((listing) => {
      return (listing.id == (firstListingResp.body.id)) || (listing.id == (secondListingResp.body.id));
    });

    __.assertThat(listingsForSameApartment, __.hasSize(1));
    __.assertThat(listingsForSameApartment[0].id, __.is(secondListingResp.body.id));
    apartmentIdWithTwoListings = firstListingResp.body.apartment_id;
  });

  it('should not return private fields', function* () {
    const getResponse = yield this.apiClient.getListings({}, true).expect(200).end();

    __.assertThat(getResponse.body, __.everyItem(__.allOf(
      __.not(__.hasProperty('property_value')),
      __.hasProperty('apartment', __.not(__.hasProperty('apt_number'))),
      __.hasProperty('apartment', __.hasProperty('building', __.not(__.hasProperty('house_number'))))
    )));
  });

  it('should get listing my lease date for a single day', function* () {
    const { body: allListings } = yield this.apiClient.getListings({ limit: 1 }).expect(200).end();
    const date = allListings[0].lease_start;
    // setting min and max to same date is expected to select that full day (and not empty range)
    const { body: dailyListings } = yield this.apiClient.getListings({ q: { minLease: date, maxLease: date } }).expect(200).end();
    __.assertThat(dailyListings, __.not(__.isEmpty()));
  });

  // TODO : add at least some basic test for filters

  describe('Filter: my listings', function () {
    const myPropertiesQuery = { q: { myProperties: true } };
    // held outside before section because of a scoping issue
    let otherApiClient, adminApiClient;

    // global test var - populated in step 2
    let createListingId;

    before(function* () {
      // switch user for test purposes
      otherApiClient = yield ApiClient.getOtherInstance();
      adminApiClient = this.adminApiClient;
      // Change this user's existing listings to deleted so we could run the tests consistently
      const myExistingListings = yield otherApiClient.getListings(myPropertiesQuery, true).expect(200).end();
      yield myExistingListings.body.map(listing => adminApiClient.patchListing(listing.id, { status: 'deleted' }).expect(200).end());
    });

    it('should not return any listings', function* () {
      let getListingResponse = yield otherApiClient.getListings(myPropertiesQuery, true).expect(200).end();

      assertNothingReturned(getListingResponse);
    });

    it('should create a listing and expect it to be returned (pending)', function* () {
      const createListingResponse = yield otherApiClient.createListing(fakeObjectGenerator.getFakeListing()).expect(201).end();
      createListingId = createListingResponse.body.id;
      let getListingResponse = yield otherApiClient.getListings(myPropertiesQuery, true).expect(200).end();

      assertListingReturned(getListingResponse);
    });

    it('set listing status to and expect it to be returned (listed)', function* () {
      yield testListingByStatus('listed');
    });

    it('set listing status to and expect it to be returned (rented)', function* () {
      yield testListingByStatus('rented');
    });

    it('set listing status to and expect it to be returned (unlisted)', function* () {
      yield testListingByStatus('unlisted');
    });

    it('set listing status to and expect it to *NOT* be returned (deleted)', function* () {
      yield testListingByStatus('deleted', false);
    });

    function* testListingByStatus(status, shouldBeReturned = true) {
      yield adminApiClient.patchListing(createListingId, { status }).expect(200).end();
      const getListingResponse = yield otherApiClient.getListings(myPropertiesQuery, true).expect(200).end();

      shouldBeReturned ? assertListingReturned(getListingResponse) : assertNothingReturned(getListingResponse);
    }

    function assertListingReturned(getListingResponse) {
      __.assertThat(getListingResponse.body, __.is(__.array()));
      __.assertThat(getListingResponse.body, __.hasSize(1));
      __.assertThat(getListingResponse.body[0].id, __.is(createListingId));
    }

    function assertNothingReturned(getListingResponse) {
      __.assertThat(getListingResponse.body, __.is(__.array()));
      __.assertThat(getListingResponse.body, __.hasSize(0));
    }

    it('should return error when not authenticated', function* () {
      yield this.apiClient.getListings(myPropertiesQuery, false).expect(403).end();
    });

    it('should return private fields', function* () {
      const getResponse = yield this.apiClient.getListings(myPropertiesQuery, true).expect(200).end();

      __.assertThat(getResponse.body, __.everyItem(__.allOf(
        __.hasProperty('apartment', __.hasProperty('apt_number')),
        __.hasProperty('apartment', __.hasProperty('building', __.hasProperty('house_number')))
      )));
    });
  });
});
