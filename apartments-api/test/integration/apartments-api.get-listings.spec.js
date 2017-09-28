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
    delete firstListing.slug;
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

  it('should return all the listings for an apartment with multiple listings WHEN oldListings = true', function* () {
    // this is the request used to get the Property Listing History
    // The preperation for this is already done in the previous test
    const q = {
      apartment_id: apartmentIdWithTwoListings,
      oldListings: true,
      myProperties: true
    };
    const getResponse = yield this.apiClient.getListings({ q }, true).expect(200).end();

    __.assertThat(getResponse.body, __.allOf(
      __.hasSize(2),
      __.everyItem(__.hasProperty('apartment_id', apartmentIdWithTwoListings))
    ));
  });

  it('should get listing my lease date for a single day', function * () {
    const { body: allListings } = yield this.apiClient.getListings({ limit: 1 }).expect(200).end();
    const date = allListings[0].lease_start;
    // setting min and max to same date is expected to select that full day (and not empty range)
    const { body: dailyListings } = yield this.apiClient.getListings({ q: { minLease: date, maxLease: date }}).expect(200).end();
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

  describe('future booking search', function() {
    let rentedListing, listedListing;

    before(function * () {
      // Create a rented listing
      rentedListing = fakeObjectGenerator.getFakeListing(
        { status: 'rented', lease_end: fakeObjectGenerator.getDateString(moment().add(2, 'months')) }
      );
      const rentedListingResponse = yield this.apiClient.createListing(rentedListing).expect(201).end();
      rentedListing = rentedListingResponse.body;
      // Create a published listing
      listedListing = fakeObjectGenerator.getFakeListing();
      const listedListingResp = yield this.apiClient.createListing(listedListing).expect(201).end();
      listedListing = listedListingResp.body;
      yield this.adminApiClient.patchListing(listedListing.id, { status: 'listed' }).expect(200).end();
    });

    const assertRentedIsNotShown = getResponse => {
      __.assertThat(getResponse.body, __.allOf(
        __.hasItem(__.hasProperty('id', listedListing.id)),
        __.not(__.hasItem(__.hasProperty('id', rentedListing.id)))
      ));
    };

    it('should not show rented apartment when futureBooking is false', function * () {
      const getResponse = yield this.apiClient.getListings({ q: { futureBooking: false } }).expect(200).end();
      assertRentedIsNotShown(getResponse);
    });

    it('should show both rented and listed apartments when futureBooking is true', function * () {
      const getResponse = yield this.apiClient.getListings().expect(200).end();

      __.assertThat(getResponse.body, __.allOf(
        __.hasItem(__.hasProperty('id', listedListing.id)),
        __.hasItem(__.hasProperty('id', rentedListing.id))
      ));
    });

    it('should not show rented apartment when rent date is too soon', function * () {
      const update = { lease_end: moment().add(1, 'week') };
      yield this.adminApiClient.patchListing(rentedListing.id, update).expect(200).end();
      const getResponse = yield this.apiClient.getListings({ q: { futureBooking: true } }).expect(200).end();
      assertRentedIsNotShown(getResponse);
    });

    it('should not show rented apartment when should not be shown for future booking', function * () {
      const update = { lease_end: moment().add(3, 'months'), show_for_future_booking: false };
      yield this.adminApiClient.patchListing(rentedListing.id, update).expect(200).end();
      const getResponse = yield this.apiClient.getListings({ q: { futureBooking: true } }).expect(200).end();
      assertRentedIsNotShown(getResponse);
    });
  });
});
