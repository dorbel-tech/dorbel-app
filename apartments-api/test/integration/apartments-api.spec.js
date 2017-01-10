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
      let numOfApartments = 5;
      
      for (let i = 0; i < numOfApartments; i++) {
        const newListing = faker.getFakeListing();
        const postReponse = yield this.apiClient.createListing(newListing).expect(201).end();
        this.createdListings.push(postReponse.body);
      }
    });

    it('should return exactly 3 listings', function* () {
      const getResponse = yield this.apiClient.getRelatedListings(this.createdListings[0].id).expect(200).end();
      __.assertThat(getResponse.body, __.hasSize(3));
    });
  });
});
