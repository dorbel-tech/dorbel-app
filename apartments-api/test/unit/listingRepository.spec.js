'use strict';
const __ = require('hamjest');
const inMemoryDb = require('../shared/inMemoryDb');
const mockRequire = require('mock-require');
const faker = require('../shared/fakeObjectGenerator');

describe('Listing Repository', function () {
  before(function * () {
    yield inMemoryDb.connect();
    this.listingRepo = mockRequire.reRequire('../../src/apartmentsDb/repositories/listingRepository');
  });

  describe('Add listing', function () {
    let createdListing;

    // TODO : some of these tests are testing logic in the Building Repository - should be moved to buildingRepository.spec.js

    it('should fail if city is not found', function* () {
      let fakeListing = {
        apartment: {
          building: {
            city: {
              city_name: 'bla'
            }
          }
        }
      };

      try {
        yield this.listingRepo.create(fakeListing);
        __.assertThat('code', __.is('not reached'));
      } catch (error) {
        __.assertThat(error.message, __.equalTo('העיר לא נמצאה'));
      }
    });

    it('should succeed in creating a valid listing with everything in it', function* () {
      createdListing = yield this.listingRepo.create(faker.getFakeListing());

      // we assume the in-memory database has been created right before this test
      __.assertThat(createdListing, __.hasProperty('id', 1));
      __.assertThat(createdListing.apartment, __.hasProperty('id', 1));
      __.assertThat(createdListing.apartment.building, __.hasProperty('id', 1));
      __.assertThat(createdListing.images[0], __.hasProperty('id', 1));
    });

    it('should not create new building if already exists', function* () {
      let listingToCreate = faker.getFakeListing();
      listingToCreate.apartment.building = createdListing.apartment.building;

      let newListing = yield this.listingRepo.create(listingToCreate);

      __.assertThat(newListing, __.hasProperty('id', 2));
      __.assertThat(newListing.apartment, __.hasProperty('id', 2));
      __.assertThat(newListing.apartment.building, __.hasProperty('id', 1));
    });

  });
});

