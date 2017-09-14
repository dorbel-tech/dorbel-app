'use strict';
const __ = require('hamjest');
const _ = require('lodash');
const faker = require('faker');
const inMemoryDb = require('../shared/inMemoryDb');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

describe('Building Repository', function () {
  before(function * () {
    yield inMemoryDb.connect();
    this.buildingRepo = require('../../src/apartmentsDb/repositories/buildingRepository');
  });

  describe('find or create', function () {
    it('should create a new building with all its properties', function * () {
      const buildingToCreate = fakeObjectGenerator.getFakeBuilding({
        street_name: faker.lorem.word(), // randomize street for new building each time
        entrance: faker.lorem.word(),
        floors: faker.random.number(100),
        elevator: faker.random.boolean(),
        // geolocation is not tested because SQLlite has a problem with it
      });

      const expectedBuilding = _.pick(buildingToCreate, ['street_name', 'house_number', 'floors', 'entrance', 'elevator']);
      expectedBuilding.city_id = buildingToCreate.city.id;

      const createdBuilding = yield this.buildingRepo.updateOrCreate(buildingToCreate);

      __.assertThat(createdBuilding, __.hasProperties(expectedBuilding));
    });

    it('should create two different building for two different entrances', function * () {
      const buildingToCreate1 = fakeObjectGenerator.getFakeBuilding({ street_name: faker.lorem.word(), entrance: faker.lorem.word() });
      const buildingToCreate2 = fakeObjectGenerator.getFakeBuilding({ street_name: buildingToCreate1.street_name, entrance: faker.lorem.word() });

      const createdBuilding1 = yield this.buildingRepo.updateOrCreate(buildingToCreate1);
      const createdBuilding2 = yield this.buildingRepo.updateOrCreate(buildingToCreate2);

      __.assertThat(createdBuilding1, __.allOf(
        __.hasProperty('entrance', buildingToCreate1.entrance),
        __.not(__.allOf(
          __.hasProperty('entrance', buildingToCreate2.entrance),
          __.hasProperty('id', createdBuilding2.id)
        ))
      ));
    });
  });
});
