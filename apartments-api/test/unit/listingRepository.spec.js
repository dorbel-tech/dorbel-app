'use strict';
const __ = require('hamjest');
const inMemoryDb = require('../shared/inMemoryDb');
const mockRequire = require('mock-require');
const faker = require('../shared/fakeObjectGenerator');

describe('Listing Repository', function () {
  before(function* () {
    yield inMemoryDb.connect();
    this.listingRepo = mockRequire.reRequire('../../src/apartmentsDb/repositories/listingRepository');
  });

  describe('Add listing', function () {
    let createdListing;

    // TODO : some of these tests are testing logic in the Building Repository - should be moved to buildingRepository.spec.js

    it('should be able to add a new city', function* () {
      let fakeListing = faker.getFakeListing();
      fakeListing.apartment.building.neighborhood_id = undefined; // new cities can't have defined neighborhoods
      fakeListing.apartment.building.city = {
        city_name: 'made up city name',
        google_place_id: 'some-random-id',
        country_id: 1
      };

      try {
        yield this.listingRepo.create(fakeListing);
      } catch (error) {
        __.assertThat('code', __.is('not reached'));
      }
    });

    it('should fail if neighborhood is not found', function* () {
      let fakeListing = faker.getFakeListing();
      fakeListing.apartment.building.city = {
        city_name: 'תל אביב יפו',
        google_place_id: 'ChIJH3w7GaZMHRURkD-WwKJy-8E',
        country_id: 1
      };
      fakeListing.apartment.building.neighborhood_id = 99999;

      try {
        yield this.listingRepo.create(fakeListing);
        __.assertThat('code', __.is('not reached'));
      } catch (error) {
        __.assertThat(error.message, __.equalTo('השכונה לא נמצאה'));
      }
    });

    it('should succeed in creating a valid listing with everything in it', function* () {
      let fakeListing = faker.getFakeListing();
      fakeListing.apartment.building.city = {
        city_name: 'תל אביב יפו',
        google_place_id: 'ChIJH3w7GaZMHRURkD-WwKJy-8E',
        country_id: 1
      };

      try {
        createdListing = yield this.listingRepo.create(fakeListing);
      } catch (error) {
        __.assertThat('code', __.is('not reached'));
      }
    });

    it('should not create new building if already exists', function* () {
      let listingToCreate = faker.getFakeListing();
      listingToCreate.apartment.building = createdListing.apartment.building;

      let newListing = yield this.listingRepo.create(listingToCreate);

      __.assertThat(newListing.apartment.building, __.hasProperty('id', createdListing.apartment.building.id));
    });

  });
});

