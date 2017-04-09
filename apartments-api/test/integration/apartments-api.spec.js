'use strict';
describe('Apartments API Integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const _ = require('lodash');
  const faker = require('../shared/fakeObjectGenerator');
  const utils = require('./utils');

  // Integration tests run with static ID as they fill the message queue with app-events
  const INTEGRATION_TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';
  const OTHER_INTEGRATION_TEST_USER_ID = '18b5d059-095f-4409-b5ab-4588f08d3a54';
  const ADMIN_INTEGRATION_TEST_USER_ID = '1483a989-b560-46c4-a759-12c2ebb4cdbf';

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser({
      id: INTEGRATION_TEST_USER_ID
    }));

    this.adminApiClient = yield ApiClient.init(faker.getFakeUser({
      id: ADMIN_INTEGRATION_TEST_USER_ID,
      role: 'admin'
    }));
  });

  describe('GET /health', function() {
    it('should be healthy', function* () {
      const res = yield this.apiClient.getHealth();
      __.assertThat(res, __.hasProperty('status', 200));
    });
  });

  describe('GET /cities', function() {
    it('should return cities', function* () {
      const cities = _.get(yield this.apiClient.getCities(), 'body');

      __.assertThat(cities, __.allOf(
        __.is(__.array()),
        __.hasSize(__.greaterThan(0)),
        __.everyItem(__.hasProperty('city_name'))
      ));
    });
  });

  describe('GET /neighborhoods', function() {
    it('should return neighborhoods', function* () {
      const cities = _.get(yield this.apiClient.getCities(), 'body');
      const neighborhoods = _.get(yield this.apiClient.getNeighborhoods(cities[0].id), 'body');

      __.assertThat(neighborhoods, __.allOf(
        __.is(__.array()),
        __.hasSize(__.greaterThan(0)),
        __.everyItem(__.hasProperty('neighborhood_name'))
      ));
    });
  });

  describe('POST /listings', function() {
    it('should add listing and return it', function* () {
      const newListing = faker.getFakeListing();
      const createdListingResp = yield this.apiClient.createListing(newListing).expect(201).end();

      yield this.adminApiClient.patchListing(createdListingResp.body.id, { status: 'listed' }).expect(200).end();

      const getResponse = yield this.apiClient.getListings().expect(200).end();
      const expected = _.pick(newListing, ['street_name', 'house_number', 'apt_number']);
      __.assertThat(getResponse.body, __.allOf(
        __.is(__.array()),
        __.hasItem(__.hasProperties(expected))
      ));
    });

    it('should fail to add a listing without monthly rent', function* () {
      const newListing = faker.getFakeListing();
      delete newListing.monthly_rent;

      const response = yield this.apiClient.createListing(newListing).expect(400).end();
      __.assertThat(response.body,
        __.hasProperty('details', __.hasItem('monthly_rent is a required field'))
      );
    });
  });

  describe('GET /listings', function () {
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

    it('should return only liked listings', function* () {
      yield utils.clearAllUserLikes(this.apiClient);

      const prepGetListingResponse = yield this.apiClient.getListings({ limit: 2 }).expect(200).end();
      yield this.apiClient.likeListing(prepGetListingResponse.body[1].id).expect(200).end();

      const getListingResponse = yield this.apiClient.getListings({ q: { liked: true } }, true).expect(200).end();

      __.assertThat(getListingResponse.body, __.is(__.array()));
      __.assertThat(getListingResponse.body, __.hasSize(1));
      __.assertThat(getListingResponse.body[0].id, __.is(prepGetListingResponse.body[1].id));

      yield utils.clearAllUserLikes(this.apiClient);
    });

    // TODO : add at least some basic test for filters

    describe('Filter: my listings', function () {
      // held outside before section because of a scoping issue
      let otherApiClient;

      // global test var - populated in step 2
      let createListingId;

      before(function* () {
        // switch user for test purposes
        otherApiClient = yield ApiClient.init(faker.getFakeUser({
          id: OTHER_INTEGRATION_TEST_USER_ID,
          role: 'user'
        }));
      });

      it('should not return any listings', function* () {
        let getListingResponse = yield otherApiClient.getListings({ q: { myProperties: true } }, true).expect(200).end();

        assertNothingReturned(getListingResponse);
      });

      it('should create a listing and expect it to be returned (pending)', function* () {
        const createListingResponse = yield otherApiClient.createListing(faker.getFakeListing()).expect(201).end();
        createListingId = createListingResponse.body.id;
        let getListingResponse = yield otherApiClient.getListings({ q: { myProperties: true } }, true).expect(200).end();

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
        yield this.adminApiClient.patchListing(createListingId, { status }).expect(200).end();
        const getListingResponse = yield otherApiClient.getListings({ q: { myProperties: true } }, true).expect(200).end();

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
    });
  });

  describe('GET /listings/{idOrSlug}', function () {
    before(function* () {
      const postReponse = yield this.apiClient.createListing(faker.getFakeListing()).expect(201).end();
      yield this.adminApiClient.patchListing(postReponse.body.id, { status: 'listed' }).expect(200).end();
      postReponse.body.status = 'listed';
      this.createdListing = _.omit(postReponse.body, ['lease_end', 'updated_at']);
    });

    it('should return a single listing by id', function* () {
      const getResponse = yield this.apiClient.getSingleListing(this.createdListing.id).expect(200).end();
      // TODO : this is a very shallow check
      __.assertThat(getResponse.body, __.hasProperties(this.createdListing));
    });

    it('should return a single listing by slug', function* () {
      const getResponse = yield this.apiClient.getSingleListing(this.createdListing.slug).expect(200).end();
      // TODO : this is a very shallow check
      __.assertThat(getResponse.body, __.hasProperties(this.createdListing));
    });
  });

  describe('PATCH /listings/{id}', function () {
    before(function* () {
      const postReponse = yield this.apiClient.createListing(faker.getFakeListing()).expect(201).end();
      yield this.adminApiClient.patchListing(postReponse.body.id, { status: 'listed' }).expect(200).end();
      this.createdListing = _.omit(postReponse.body, ['lease_end', 'updated_at']);
    });

    it('should update listing status', function* () {
      const response = yield this.apiClient.patchListing(this.createdListing.id, { status: 'rented' }).expect(200).end();
      __.assertThat(response.body.status, __.is('rented'));
    });
  });

  describe('GET /listings/{id}/related', function () {
    before(function* () {
      this.createdListings = [];
      const numOfApartments = 5;

      for (let i = 0; i < numOfApartments; i++) {
        const newListing = faker.getFakeListing();
        const postReponse = yield this.apiClient.createListing(newListing).expect(201).end();
        yield this.adminApiClient.patchListing(postReponse.body.id, { status: 'listed' }).expect(200).end();
        this.createdListings.push(postReponse.body);
      }

      this.listingId = this.createdListings[0].id;
    });

    it('should return exactly 3 listings', function* () {
      const getResponse = yield this.apiClient.getRelatedListings(this.listingId).expect(200).end();
      __.assertThat(getResponse.body, __.hasSize(3));
    });

    it('should not return the current/requested listing', function* () {
      // Preperation: set the 2 last created listings' status to 'unlisted'
      const idsToUnlist = _.map(_.takeRight(this.createdListings, 2), 'id');
      const that = this;
      _.each(idsToUnlist, function (id) {
        that.apiClient.patchListing(id, { status: 'rented' }).expect(200).end();
      });


      const getResponse = yield this.apiClient.getRelatedListings(this.listingId).expect(200).end();
      const responseIds = _.map(getResponse, 'id');

      __.assertThat(responseIds, __.not(__.hasItem(this.listingId)));
    });

    it('should return listings from the same city as the requested listing', function* () {
      const getListingResponse = yield this.apiClient.getSingleListing(this.listingId).expect(200).end();
      const cityId = getListingResponse.body.apartment.building.city_id;

      const getRelatedResponse = yield this.apiClient.getRelatedListings(this.listingId).expect(200).end();
      const respCityIds = _.map(getRelatedResponse.body, function (listing) {
        return listing.apartment.building.city.id;
      });
      __.assertThat(respCityIds, __.everyItem(__.is(cityId)));
    });
  });

  describe('GET /page_views/listings/{listingIds}', function () {
    it('should get listing page views', function* () {
      const response = yield this.apiClient.getListingPageViews([1,2]);

      __.assertThat(response.body, __.everyItem(__.hasProperty('views')));
    });
  });
});
