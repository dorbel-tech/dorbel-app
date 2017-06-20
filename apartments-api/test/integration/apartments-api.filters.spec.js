'use strict';
const _ = require('lodash');
const __ = require('hamjest');
const faker = require('faker');
const ApiClient = require('./apiClient.js');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

describe('Apartments API - saved filters - ', function () {

  function createFilter() {
    return {
      city: faker.random.number(20),
      mre: faker.random.number(10000),
      mrs: faker.random.number(10000),
      minRooms: faker.random.number(20),
      maxRooms: faker.random.number(20),
    };
  }

  before(function* () {
    this.apiClient = yield ApiClient.getInstance();
    // delete all existing filters of the test user
    const { body: existingFilters } = yield this.apiClient.getFilters().expect(200).end();
    yield existingFilters.map(filter => this.apiClient.deleteFilter(filter.id).expect(204).end());
  });

  it('should create new filter', function * () {
    const newFilter = createFilter();
    const { body: createdFilter } = yield this.apiClient.createFilter(newFilter).expect(200).end();

    __.assertThat(createdFilter, __.hasProperties(newFilter));
    this.createdFilter = createdFilter;
  });

  it('should return existing filter when trying to create a duplicate filter', function * () {
    const duplicateFilter = _.pick(this.createdFilter, ['city', 'mre', 'mrs', 'minRooms', 'maxRooms']);
    const { body: createdFilter } = yield this.apiClient.createFilter(duplicateFilter).expect(200).end();
    __.assertThat(createdFilter, __.hasProperty('id', this.createdFilter.id));
  });

  it('should fail to create a new filter with missing fields', function * () {
    yield this.apiClient.createFilter({
      city: faker.random.number(20),
      mre: faker.random.number(10000)
    }).expect(400).end();
  });

  it('should fail to save more than 3 filters', function * () {
    // assuming we've only create 1 until now
    yield this.apiClient.createFilter(createFilter()).expect(200).end();
    yield this.apiClient.createFilter(createFilter()).expect(200).end();
    const { text: error } = yield this.apiClient.createFilter(createFilter()).expect(400).end();
    __.assertThat(error, __.containsString('לא ניתן לשמור יותר משלושה חיפושים'));
  });

  it('should get filters', function * () {
    const { body: myFilters } = yield this.apiClient.getFilters().expect(200).end();

    __.assertThat(myFilters, __.allOf(
      __.hasSize(3),
      __.everyItem(__.hasProperty('dorbel_user_id', this.apiClient.userProfile.id))
    ));
  });

  it('should update a filter', function * () {
    const filterUpdate = createFilter();
    filterUpdate.email_notification = true;

    const { body: updatedFilter } = yield this.apiClient.putFilter(this.createdFilter.id, filterUpdate).expect(200).end();

    __.assertThat(updatedFilter, __.allOf(
      __.hasProperties(filterUpdate),
      __.hasProperty('id', this.createdFilter.id)
    ));
  });

  it('should not update a filter with not enough properties', function * () {
    const filterUpdate = {
      minRooms: faker.random.number(20)
    };
    yield this.apiClient.putFilter(this.createdFilter.id, filterUpdate).expect(400).end();
  });

  it('should not update a filter of another user', function * () {
    const otherClient = yield ApiClient.getOtherInstance();
    yield otherClient.putFilter(this.createdFilter.id, createFilter()).expect(403).end();
  });

  it('should not update a non-existing filter', function * () {
    yield this.apiClient.putFilter(99999, createFilter()).expect(404).end();
  });

  describe('matching filters endpoint - ', function () {
    let filter, listing;
    // As the listing->filter matching is actually done in DB queries, much of the testing will need to be integration testing
    before(function* () {
      this.adminClient = yield ApiClient.getAdminInstance();
      // delete any filters the admin might have already
      const { body: existingFilters } = yield this.adminClient.getFilters().expect(200).end();
      yield existingFilters.map(filter => this.adminClient.deleteFilter(filter.id).expect(204).end());
    });

    it('should match filter', function * () {
      const newListing = fakeObjectGenerator.getFakeListing();
      const { body: createdListing } = yield this.adminClient.createListing(newListing).expect(201).end();
      const newFilter = {
        email_notification: true,
        city: newListing.apartment.building.city_id,
        mrs: newListing.monthly_rent - 1, 
        mre: newListing.monthly_rent + 1, 
        minRooms: newListing.apartment.rooms - 1,
        maxRooms: newListing.apartment.rooms + 1,
      };
      const { body: createdFilter } = yield this.adminClient.createFilter(newFilter).expect(200).end();

      const { body: matchedFilters } = yield this.adminClient.getFilters({ matchingListingId: createdListing.id }).expect(200).end();

      __.assertThat(matchedFilters, __.hasItem(__.hasProperty('id', createdFilter.id)));
      filter = createdFilter;
      listing = createdListing;
    });

    it('should not match filter with email_notification: false', function * () {
      filter.email_notification = false;
      yield this.adminClient.putFilter(filter.id, filter).expect(200).end();
      
      const { body: matchedFilters } = yield this.adminClient.getFilters({ matchingListingId: listing.id }).expect(200).end();

      __.assertThat(matchedFilters, __.isEmpty());
    });
    
  });

});
