'use strict';
describe('Apartments API Integration', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const _ = require('lodash');
  const faker = require('../shared/fakeObjectGenerator');

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  describe('/cities', function() {
    it('should return cities', function* () {
      const cities = _.get(yield this.apiClient.getCities(), 'body');

      __.assertThat(cities, __.allOf(
        __.is(__.array()),
        __.everyItem(__.hasProperty('city_name'))
      ));
    });
  });

  describe('/listings', function() {
    it('should add listing and return it', function* () {
      this.timeout(10000);
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

  describe('/listings/{id}', function () {
    before(function* () {
      const newListing = faker.getFakeListing();
      const postReponse = yield this.apiClient.createListing(newListing).expect(201).end();
      this.createdListing = postReponse.body;
    });

    it('should return a single listing', function* () {
      const getResponse = yield this.apiClient.getSingleListing(this.createdListing.id).expect(200).end();
      // TODO : this is a very shallow check
      __.assertThat(getResponse.body, __.hasProperties(this.createdListing));
    });

    it('should update listing status', function* () {
      const response = yield this.apiClient.updateSingleListingStatus(this.createdListing.id, { status: 'rented' }).expect(200).end();
      __.assertThat(response.body.status, __.is('rented'));
    });
  });

  describe('/listings/{id}/related', function () {
    before(function* () {
      this.timeout(10000);
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
        that.apiClient.updateSingleListingStatus(id, { status: 'rented' }).expect(200).end();
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
        return listing.apartment.building.city_id;
      });
      __.assertThat(respCityIds, __.everyItem(__.is(cityId)));
    });
  });
});
