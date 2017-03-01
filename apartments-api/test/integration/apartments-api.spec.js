'use strict';
describe('Apartments API Integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const _ = require('lodash');
  const faker = require('../shared/fakeObjectGenerator');

  // Integration tests run with static ID as they fill the message queue with app-events
  const INTEGRATION_TEST_USER_ID = '23821212-6191-4fda-b3e3-fdb8bf69a95d';

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser({
      id: INTEGRATION_TEST_USER_ID
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

      yield this.apiClient.createListing(newListing).expect(201).end();
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

  describe('GET /listings/{idOrSlug}', function () {
    before(function* () {
      const postReponse = yield this.apiClient.createListing(faker.getFakeListing()).expect(201).end();
      this.createdListing = _.omit(postReponse.body, [ 'lease_end', 'updated_at' ]);
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
      this.createdListing = _.omit(postReponse.body, [ 'lease_end', 'updated_at' ]);
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
});
