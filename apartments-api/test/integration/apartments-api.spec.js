'use strict';
describe('/listings', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');
  const _ = require('lodash');
  const faker = require('../shared/fakeObjectGenerator');

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  it('should add listing and return it', function* () {
    const newListing = faker.getFakeListing();

    yield this.apiClient.createListing(newListing).expect(201).end();
    const getResponse = yield this.apiClient.getListings().expect(200).end();
    const expected = _.pick(newListing, ['street_name', 'house_number', 'unit']);
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
