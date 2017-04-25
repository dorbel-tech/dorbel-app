'use strict';
const ApiClient = require('./apiClient.js');
// const _ = require('lodash');
const __ = require('hamjest');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');
const faker = require('faker');

describe.only('Apartments API Listing Users integration', function () {
  before(function * () {
    this.apiClient = yield ApiClient.getInstance();
    const postResponse = yield this.apiClient.createListing(fakeObjectGenerator.getFakeListing()).expect(201).end();
    this.createdListing = postResponse.body;
  });

  it('should add a `guest` tenant to a listing', function * () {
    const first_name = faker.name.firstName();
    const response = yield this.apiClient.postTenant(this.createdListing.id, { first_name }).expect(201).end();
    __.assertThat(response.body, __.hasProperties({
      first_name,
      listing_id: this.createdListing.id.toString()
    }));
  });

  it('should not allow adding a tenant to another users listing', function * () {
    const otherApiClient = yield ApiClient.getOtherInstance();
    yield otherApiClient.postTenant(this.createdListing.id, {}).expect(403).end();
  });

  it('should not allow adding a tenant without first name or email', function * () {
    yield this.apiClient.postTenant(this.createdListing.id, { last_name: 'bla' }).expect(400).end();
  });

  it('should save all the params on a `guest` tenant', function * () {
    const tenant = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.phoneNumber()
    };

    const response = yield this.apiClient.postTenant(this.createdListing.id, tenant).expect(201).end();
    __.assertThat(response.body, __.hasProperties(tenant));
  });

  it('should create a tenant with a known email using the data in auth0', function * () {
    const tenant = {
      email: this.apiClient.userProfile.email,
      first_name: 'something_else'
    };
    const response = yield this.apiClient.postTenant(this.createdListing.id, tenant).expect(201).end();
    __.assertThat(response.body, __.hasProperties({
      first_name: this.apiClient.userProfile.first_name,
      last_name: this.apiClient.userProfile.last_name,
      phone_number: this.apiClient.userProfile.phone,
      user_id: this.apiClient.userProfile.id
    }));
  });
});
