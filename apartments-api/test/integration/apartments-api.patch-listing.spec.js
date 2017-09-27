'use strict';
const _ = require('lodash');
const __ = require('hamjest');
const faker = require('faker');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');
const ApiClient = require('./apiClient.js');

describe('Integration - PATCH /listings/{id}', function () {
  let apiClient, adminApiClient, createdListing, fakeListingObj;

  before(function* () {
    apiClient = yield ApiClient.getInstance();
    adminApiClient = yield ApiClient.getAdminInstance();
    fakeListingObj = fakeObjectGenerator.getFakeListing();
    let postResponse = yield apiClient.createListing(fakeListingObj).expect(201).end();
    postResponse = yield adminApiClient.patchListing(postResponse.body.id, { status: 'listed' }).expect(200).end();
    createdListing = postResponse.body;
  });

  it.only('should return an error if the patch conflicts with another apartments details', function* () {
    let listingToPatch = _.clone(fakeListingObj);
    const aptNumToConflict = _.clone(fakeListingObj.apartment.apt_number);

    delete listingToPatch.slug;
    listingToPatch.status = 'rented';
    listingToPatch.apartment.apt_number = 'test1';

    let postResponse = yield apiClient.createListing(listingToPatch).expect(201).end();

    const patch = {
      apartment: {
        apt_number: aptNumToConflict
      }
    };

    const patchResponse = yield apiClient.patchListing(postResponse.body.id, patch).expect(409).end();
    __.assertThat(patchResponse.text, __.is('דירה עם פרטים זהים כבר קיימת במערכת'));
  });

  it.only('should update listing status', function* () {
    const response = yield apiClient.patchListing(createdListing.id, { status: 'rented' }).expect(200).end();
    __.assertThat(response.body.status, __.is('rented'));
  });

  it.only('should update entire listing with apartment and building properties', function* () {
    const listingUpdate = { monthly_rent: faker.random.number(20000) };
    const apartmentUpdate = { rooms: faker.random.number(10) };
    const buildingUpdate = { floors: faker.random.number(100) };

    const update = Object.assign({}, listingUpdate, { apartment: Object.assign({}, apartmentUpdate, { building: buildingUpdate }) });

    const response = yield apiClient.patchListing(createdListing.id, update).expect(200).end();

    __.assertThat(response.body, __.allOf(
      __.hasProperties(listingUpdate),
      __.hasProperty('apartment', __.allOf(
        __.hasProperties(apartmentUpdate),
        __.hasProperty('building', __.allOf(
          __.hasProperties(buildingUpdate),
          __.hasProperty('id', createdListing.apartment.building.id)
        ))
      ))
    ));

    createdListing = response.body; // used in tests below
  });

  it.only('should not update some details and not others (test transaction)', function* () {
    const update = {
      publishing_user_type: 'bad-value',
      apartment: {
        rooms: faker.random.number(50)
      }
    };

    yield apiClient.patchListing(createdListing.id, update).expect(500).end();
    const response = yield apiClient.getSingleListing(createdListing.id).expect(200).end();

    __.assertThat(response.body, __.allOf(
      __.hasProperty('publishing_user_type', createdListing.publishing_user_type),
      __.not(__.hasProperty('publishing_user_type', update.publishing_user_type)),
      __.hasProperty('apartment', __.allOf(
        __.hasProperty('rooms', createdListing.apartment.rooms),
        __.not(__.hasProperty('rooms', update.apartment.rooms)),
      ))
    ));
  });

  it('should move to a different building if building details changed', function* () {
    const update = {
      apartment: {
        building: {
          street_name: faker.address.streetName()
        }
      }
    };

    const response = yield apiClient.patchListing(createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment.building, __.hasProperties({
      street_name: update.apartment.building.street_name,
      house_number: createdListing.apartment.building.house_number,
      id: __.not(__.is(createdListing.apartment.building.id))
    }));

    createdListing = response.body; // used in tests below
  });

  it('should change apartment details without changing apartment id', function* () {
    let updatedListing = _.clone(createdListing);
    updatedListing.apartment.apt_number = faker.random.word();

    const response = yield apiClient.patchListing(createdListing.id, updatedListing).expect(200).end();

    __.assertThat(response.body.apartment, __.hasProperties({
      apt_number: updatedListing.apartment.apt_number,
      id: createdListing.apartment.id
    }));
  });

  it('should update building with details when not moving to a different building', function* () {
    let update = _.set({}, 'apartment.building.elevator', !createdListing.apartment.building.elevator);
    _.set(update, 'apartment.building.neighborhood.id', 2);

    const response = yield apiClient.patchListing(createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment.building, __.hasProperties({
      elevator: update.apartment.building.elevator,
      id: createdListing.apartment.building.id
    }));

    createdListing = response.body; // used in tests below
  });

  it('should take details for new building from update request and existing building', function* () {
    const update = {
      apartment: {
        building: {
          street_name: faker.address.streetName(),
          elevator: !createdListing.apartment.building.elevator
        }
      }
    };

    const response = yield apiClient.patchListing(createdListing.id, update).expect(200).end();

    __.assertThat(response.body.apartment.building, __.hasProperties({
      street_name: update.apartment.building.street_name,
      elevator: update.apartment.building.elevator,
      city_id: createdListing.apartment.building.city_id,
      id: __.not(__.is(createdListing.apartment.building.id))
    }));

    createdListing = response.body; // used in tests below
  });

  it('should ignore non-whitelisted properties for update', function* () {
    let updatedListing = _.clone(createdListing);
    updatedListing.publishing_user_id = faker.random.uuid(); // will be ignored
    updatedListing.directions = faker.lorem.sentence();

    const response = yield apiClient.patchListing(createdListing.id, updatedListing).expect(200).end();

    __.assertThat(response.body, __.hasProperties({
      directions: updatedListing.directions,
      publishing_user_id: createdListing.publishing_user_id
    }));
  });

  it('should fail to update another users listing', function* () {
    const otherUserApi = yield ApiClient.getOtherInstance();
    yield otherUserApi.patchListing(createdListing.id, { directions: 'bla' }).expect(403).end();
  });

  it('should fail to update to a non-existing city', function* () {
    yield apiClient.patchListing(createdListing.id, _.set({}, 'apartment.building.city.id', 100)).expect(400).end();
  });

  it('should fail to update to a non-existing neighborhood', function* () {
    yield apiClient.patchListing(createdListing.id, _.set({}, 'apartment.building.neighborhood.id', 100)).expect(400).end();
  });

  it('should fail for non-existing listing', function* () {
    yield apiClient.patchListing(123456, { monthly_rent: 1000 }).expect(404).end();
  });

  function* updateAndAssertImages(images) {
    let updatedListing = _.clone(createdListing);
    updatedListing.images = images;
    const response = yield apiClient.patchListing(createdListing.id, updatedListing).expect(200).end();

    __.assertThat(response.body.images, __.allOf(
      __.hasSize(images.length),
      // images don't have to come back in the correct order but they need to have the correct display_order property
      __.containsInAnyOrder.apply(__, images.map((image) => __.hasProperties({ url: image.url, display_order: image.display_order })))
    ));

    createdListing = response.body; // used in tests below
  }

  it('should add an image', function* () {
    yield updateAndAssertImages(createdListing.images.concat([fakeObjectGenerator.getFakeImage()]));
  });

  it('should change image order', function* () {
    yield updateAndAssertImages(createdListing.images.reverse());
  });

  it('should remove an image', function* () {
    yield updateAndAssertImages([createdListing.images[1]]);
  });
});
