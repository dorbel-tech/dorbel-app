'use strict';
var __ = require('hamjest');
const inMemoryDb = require('../shared/inMemoryDb');
var faker = require('../shared/fakeObjectGenerator');

describe('Listing Repository', function () {
  before(function * () {
    yield inMemoryDb.connect();
    this.listingRepo = require('../../src/apartmentDb/repositories/listingRepository');
  });

  describe('Add listing', function () {
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
        __.assertThat(error.message, __.equalTo('did not find city'));
      }
    });

    it('should succeed in creating a valid listing with everything in it', function* () {
      let newListing = yield this.listingRepo.create(faker.getFakeListing());

      // we assume the in-memory database has been created right before this test
      __.assertThat(newListing, __.hasProperty('id', 1));
      __.assertThat(newListing.apartment, __.hasProperty('id', 1));
      __.assertThat(newListing.apartment.building, __.hasProperty('id', 1));
      __.assertThat(newListing.images[0], __.hasProperty('id', 1));
      __.assertThat(newListing.open_house_events[0], __.hasProperty('id', 1));
    });

    it('should not create new building if already exists', function* () {
      // depends on faker.getFakeListing to return constant address but random apartment
      let newListing = yield this.listingRepo.create(faker.getFakeListing());
      __.assertThat(newListing, __.hasProperty('id', 2));
      __.assertThat(newListing.apartment, __.hasProperty('id', 2));
      __.assertThat(newListing.apartment.building, __.hasProperty('id', 1));
    });

  });
});

