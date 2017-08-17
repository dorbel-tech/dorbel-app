'use strict';
const _ = require('lodash');
const __ = require('hamjest');
const faker = require('faker');
const ApiClient = require('./apiClient.js');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

describe('Apartments API - saved filters - ', function () {

  function createFilter() {
    return {
      city: faker.random.number({ min: 1, max: 20 }),
      mre: faker.random.number({ min: 1, max: 10000 }),
      mrs: faker.random.number({ min: 1, max: 10000 }),
      minRooms: faker.random.number({ min: 1, max: 20 }),
      maxRooms: faker.random.number({ min: 1, max: 20 })
    };
  }

  before(function * () {
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

  it('should mark email_notifiaction as true by default', function * () {
    // assuming creation in previous test
    __.assertThat(this.createdFilter, __.hasProperty('email_notification', true));
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
    let matchingFilter, unmatchingFilter, listing, adminClient;
    // As the listing->filter matching is actually done in DB queries, much of the testing will need to be integration testing

    const getMatchingFilter = (mrsDelta) => ({
      email_notification: true,
      city: listing.apartment.building.city_id,
      mrs: listing.monthly_rent - (mrsDelta || 0),
      minRooms: listing.apartment.rooms,
    });

    function * assertMatchingFilters() {
      yield adminClient.putFilter(unmatchingFilter.id, unmatchingFilter).expect(200).end();
      yield adminClient.putFilter(matchingFilter.id, matchingFilter).expect(200).end();
      const { body: matchedFilters } = yield adminClient.getFilters({ matchingListingId: listing.id }).expect(200).end();

      __.assertThat(matchedFilters, __.allOf(
        __.hasItem(__.hasProperty('id', matchingFilter.id)),
        __.not(__.hasItem(__.hasProperty('id', unmatchingFilter.id)))
      ));
    }

    before(function* () {
      adminClient = yield ApiClient.getAdminInstance();
      // delete any filters the admin might have already
      const { body: existingFilters } = yield adminClient.getFilters().expect(200).end();
      yield existingFilters.map(filter => adminClient.deleteFilter(filter.id).expect(204).end());
      // create a listing to play with
      listing = fakeObjectGenerator.getFakeListing();
      const { body: createdListing } = yield adminClient.createListing(listing).expect(201).end();
      listing.id = createdListing.id;
      // create some filters to test - both are created in a matching state
      matchingFilter = (yield adminClient.createFilter(getMatchingFilter()).expect(200).end()).body;
      unmatchingFilter = (yield adminClient.createFilter(getMatchingFilter(1)).expect(200).end()).body;
    });

    beforeEach(function * () {
      // reset both filters to matching state
      yield adminClient.putFilter(matchingFilter.id, getMatchingFilter()).expect(200).end();
      yield adminClient.putFilter(unmatchingFilter.id, getMatchingFilter(1)).expect(200).end();
    });

    it('should not match filter with email_notification: false', function * () {
      unmatchingFilter.email_notification = false;
      yield assertMatchingFilters();
    });

    it('should match filter by neighborhood', function * () {
      matchingFilter.neigborhood = listing.apartment.building.neighborhood_id;
      unmatchingFilter.neigborhood = listing.apartment.building.neighborhood_id + 1;
      yield assertMatchingFilters();
    });

    it('should not match filters by minimum monthly rent', function * () {
      unmatchingFilter.mrs = listing.monthly_rent + 1;
      yield assertMatchingFilters();
    });

    it('should match filter by max monthly rent', function * () {
      matchingFilter.mre = listing.monthly_rent;
      unmatchingFilter.mre = listing.monthly_rent - 1;
      yield assertMatchingFilters();
    });

    it('should match filter by min rooms', function * () {
      unmatchingFilter.minRooms = listing.apartment.rooms + 1;
      yield assertMatchingFilters();
    });

    it('should match filter by max rooms', function * () {
      unmatchingFilter.maxRooms = listing.apartment.rooms - 1;
      yield assertMatchingFilters();
    });

    it('should match filter by apartment amenity', function * () {
      matchingFilter.air_conditioning = !!listing.apartment.air_conditioning;
      unmatchingFilter.air_conditioning = !listing.apartment.air_conditioning;
      yield assertMatchingFilters();
    });

    it('should match filter by building amenity', function * () {
      matchingFilter.elevator = !!listing.apartment.building.elevator;
      unmatchingFilter.elevator = !listing.apartment.building.elevator;
      yield assertMatchingFilters();
    });

    it('should match by future booking', function * () {
      yield adminClient.patchListing(listing.id, { status: 'rented', show_for_future_booking: true });
      matchingFilter.futureBooking = true;
      unmatchingFilter.futureBooking = false;
      yield assertMatchingFilters();
    });

    it('should not match by future booking if listing is not meant to be shown for future booking', function * () {
      yield adminClient.patchListing(listing.id, { status: 'rented', show_for_future_booking: false }).expect(200).end();
      matchingFilter.futureBooking = true;
      yield adminClient.putFilter(matchingFilter.id, matchingFilter).expect(200).end();

      const { body: matchedFilters } = yield adminClient.getFilters({ matchingListingId: listing.id }).expect(200).end();

      __.assertThat(matchedFilters, __.not(__.hasItem(__.hasProperty('id', matchingFilter.id))));
    });
  });

  describe('using graphql', function () {
    before(async function() {
      const { body: existingFilters } = await this.apiClient.getFilters().expect(200);
      await Promise.all( // delete all existing filters of the test user
        existingFilters.map(filter => this.apiClient.deleteFilter(filter.id).expect(204))
      );
    });

    const upsertFilterMutation = filter => `
      mutation createFilter($filter: FilterInput!) {
        upsertFilter(filter: $filter) {
          id, dorbel_user_id, ${Object.keys(filter).join(', ')}
        }
      }
    `;

    const myFiltersQuery = `
      query getFilters {
        filters { id }
      }
    `;

    it('should create new filter', async function () {
      const newFilter = createFilter();

      const { body: { data: { upsertFilter: createdFilter } } } = await this.apiClient.gql(upsertFilterMutation(newFilter), { filter: newFilter }).expect(200);

      __.assertThat(createdFilter, __.allOf(
        __.hasProperties(newFilter),
        __.hasProperties({ dorbel_user_id: this.apiClient.userProfile.id, id: __.is(__.number()) })
      ));
      this.createdFilter = createdFilter;
    });

    it('should get filters', async function () {
      const { body: { data: { filters: myFilters } } } = await this.apiClient.gql(myFiltersQuery).expect(200);

      __.assertThat(myFilters, __.hasSize(1));
      __.assertThat(myFilters[0], __.hasProperty('id', this.createdFilter.id));
    });

    it('should update a filter', async function () {
      const filterUpdate = createFilter();
      filterUpdate.id = this.createdFilter.id;

      const { body: { data: { upsertFilter: updatedFilter } } } = await this.apiClient.gql(upsertFilterMutation(filterUpdate), { filter: filterUpdate }).expect(200);

      __.assertThat(updatedFilter, __.hasProperties(filterUpdate));
    });

    it('should delete a filter', async function () {
      await this.apiClient.gql(`
        mutation deleteFilter($id: Int!) {
          deleteFilter(id: $id)
        }
      `, { id: this.createdFilter.id }).expect(200);

      const { body: { data: { filters: myFilters } } } = await this.apiClient.gql(myFiltersQuery).expect(200);
      __.assertThat(myFilters, __.hasSize(0));
    });
  });
});
