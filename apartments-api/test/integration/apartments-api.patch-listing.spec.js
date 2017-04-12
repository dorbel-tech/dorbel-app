'use strict';
const _ = require('lodash');
const __ = require('hamjest');
const faker = require('faker');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');
const ApiClient = require('./apiClient.js');

describe('Integration - PATCH /listings/{id}', function () {
  before(function* () {
    this.apiClient = yield ApiClient.getInstance();
    this.adminApiClient = yield ApiClient.getAdminInstance();
    let postResponse = yield this.apiClient.createListing(fakeObjectGenerator.getFakeListing()).expect(201).end();
    postResponse = yield this.adminApiClient.patchListing(postResponse.body.id, { status: 'listed' }).expect(200).end();
    this.createdListing = postResponse.body;
  });

  it('should update listing status', function* () {
    const response = yield this.apiClient.patchListing(this.createdListing.id, { status: 'rented' }).expect(200).end();
    __.assertThat(response.body.status, __.is('rented'));
  });

  it('should update entire listing with apartment and building properties', function* () {
    const listingUpdate = { monthly_rent: faker.random.number(20000) };
    const apartmentUpdate = { rooms: faker.random.number(10) };
    const buildingUpdate = { floors: faker.random.number(100) };

    const update = Object.assign({}, listingUpdate, { apartment: Object.assign({}, apartmentUpdate, { building: buildingUpdate})});

    const response = yield this.apiClient.patchListing(this.createdListing.id, update).expect(200).end();

    __.assertThat(response.body, __.allOf(
      __.hasProperties(listingUpdate),
      __.hasProperty('apartment', __.allOf(
        __.hasProperties(apartmentUpdate),
        __.hasProperty('building', __.allOf(
          __.hasProperties(buildingUpdate),
          __.hasProperty('id', this.createdListing.apartment.building.id)
        ))
      ))
    ));

    this.createdListing = response.body; // used in tests below
  });

  it('should not update some details and not others (test transaction)', function * () {
    const update = {
      publishing_user_type: 'bad-value',
      apartment: {
        rooms: faker.random.number(50)
      }
    };

    yield this.apiClient.patchListing(this.createdListing.id, update).expect(500).end();
    const response = yield this.apiClient.getSingleListing(this.createdListing.id).expect(200).end();

    __.assertThat(response.body, __.allOf(
      __.hasProperty('publishing_user_type', this.createdListing.publishing_user_type),
      __.not(__.hasProperty('publishing_user_type', update.publishing_user_type)),
      __.hasProperty('apartment', __.allOf(
        __.hasProperty('rooms', this.createdListing.apartment.rooms),
      __.not(__.hasProperty('rooms', update.apartment.rooms)),
      ))
    ));
  });

  it('should move to a different building if building details changed', function * () {
    const update = {
      apartment: {
        building: {
          street_name: faker.address.streetName()
        }
      }
    };

    const response = yield this.apiClient.patchListing(this.createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment.building, __.hasProperties({
      street_name: update.apartment.building.street_name,
      house_number: this.createdListing.apartment.building.house_number,
      id: __.not(__.is(this.createdListing.apartment.building.id))
    }));

    this.createdListing = response.body; // used in tests below
  });

  it('should change apartment details without changing apartment id', function * () {
    const update = {
      apartment: {
        apt_number: faker.random.word()
      }
    };

    const response = yield this.apiClient.patchListing(this.createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment, __.hasProperties({
      apt_number: update.apartment.apt_number,
      id: this.createdListing.apartment.id
    }));
  });

  it('should update building with details when not moving to a different building', function * () {
    const update = _.set({}, 'apartment.building.elevator', !this.createdListing.apartment.building.elevator);

    const response = yield this.apiClient.patchListing(this.createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment.building, __.hasProperties({
      elevator: update.apartment.building.elevator,
      id: this.createdListing.apartment.building.id
    }));

    this.createdListing = response.body; // used in tests below
  });

  it('should take details for new building from update request and existing building', function * () {
    const update = {
      apartment: {
        building: {
          street_name: faker.address.streetName(),
          elevator: !this.createdListing.apartment.building.elevator
        }
      }
    };

    const response = yield this.apiClient.patchListing(this.createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment.building, __.hasProperties({
      street_name: update.apartment.building.street_name,
      elevator: update.apartment.building.elevator,
      city_id: this.createdListing.apartment.building.city_id,
      id: __.not(__.is(this.createdListing.apartment.building.id))
    }));

    this.createdListing = response.body; // used in tests below
  });

  it('should ignore non-whitelisted properties for update', function * () {
    const update = {
      publishing_user_id: faker.random.uuid(), // will be ignored
      directions : faker.lorem.sentence()
    };

    const response = yield this.apiClient.patchListing(this.createdListing.id, update).expect(200).end();

    __.assertThat(response.body, __.hasProperties({
      directions: update.directions,
      publishing_user_id: this.createdListing.publishing_user_id
    }));
  });

  it('should fail to update another users listing', function * () {
    const otherUserApi = yield ApiClient.getOtherInstance();
    yield otherUserApi.patchListing(this.createdListing.id, { directions: 'bla' }).expect(403).end();
  });

  it('should fail to update to a non-existing city', function * () {
    yield this.apiClient.patchListing(this.createdListing.id, _.set({}, 'apartment.building.city.id', 100)).expect(400).end();
  });

  it('should fail to update to a non-existing neighborhood', function * () {
    yield this.apiClient.patchListing(this.createdListing.id, _.set({}, 'apartment.building.neighborhood.id', 100)).expect(400).end();
  });

  it('should fail for non-existing listing', function * () {
    yield this.apiClient.patchListing(123456, { monthly_rent: 1000 }).expect(404).end();
  });
});
