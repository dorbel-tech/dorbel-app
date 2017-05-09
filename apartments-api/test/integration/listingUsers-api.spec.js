'use strict';
const ApiClient = require('./apiClient.js');
const _ = require('lodash');
const __ = require('hamjest');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');
const faker = require('faker');

describe.only('Apartments API Listing Users integration', function () {
  let guestTenant;

  before(function * () {
    this.apiClient = yield ApiClient.getInstance();
    this.otherApiClient = yield ApiClient.getOtherInstance();
    this.adminClient = yield ApiClient.getAdminInstance();
    const postResponse = yield this.apiClient.createListing(fakeObjectGenerator.getFakeListing()).expect(201).end();
    this.createdListing = postResponse.body;
  });

  describe('POST listing tenants', function () {
    it('should add a `guest` tenant to a listing', function * () {
      const first_name = faker.name.firstName();
      const response = yield this.apiClient.postTenant(this.createdListing.id, { first_name }).expect(201).end();
      __.assertThat(response.body, __.hasProperties({
        first_name,
        listing_id: this.createdListing.id.toString(),
        id: __.number()
      }));
    });

    it('should add a `guest` tenant with a hebrew first name', function * () {
      const first_name = 'אבי';
      const response = yield this.apiClient.postTenant(this.createdListing.id, { first_name }).expect(201).end();
      __.assertThat(response.body, __.hasProperties({
        first_name,
        listing_id: this.createdListing.id.toString(),
        id: __.number()
      }));
    });

    it('should not allow adding a tenant to another users listing', function * () {
      yield this.otherApiClient.postTenant(this.createdListing.id, {}).expect(403).end();
    });

    it('should allow admin to add a tenant to any listing', function * () {
      yield this.adminClient.postTenant(this.createdListing.id, { first_name: faker.name.firstName() }).expect(201).end();
    });

    it('should not allow adding a tenant without first name or email', function * () {
      yield this.apiClient.postTenant(this.createdListing.id, { last_name: 'bla' }).expect(400).end();
    });

    it('should save all the params on a `guest` tenant', function * () {
      guestTenant = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber()
      };

      const response = yield this.apiClient.postTenant(this.createdListing.id, guestTenant).expect(201).end();
      __.assertThat(response.body, __.hasProperties(guestTenant));
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
        phone: this.apiClient.userProfile.phone,
        id: __.number()
      }));
    });

    it('should return 404 when adding tenant to non-existant listing', function * () {
      yield this.apiClient.postTenant(100000, {}).expect(404).end();
    });
  });

  describe('GET Listing tenants', function () {
    it('should succesfully get tenants from listing', function * () {
      const response = yield this.apiClient.getTenants(this.createdListing.id).expect(200).end();
      // these assertions depend on the tenants created in the POST tenants tests
      __.assertThat(response.body, __.allOf(
        __.hasItems(
          __.hasProperties(_.pick(this.apiClient.userProfile, [ 'first_name', 'last_name', 'phone' ])),
          __.hasProperties(guestTenant)
        ),
        __.everyItem(__.hasProperties({ id: __.number(), first_name: __.string() }))
      ));
    });

    it('should not allow to get tenants for other landlords listing', function * () {
      yield this.otherApiClient.getTenants(this.createdListing.id).expect(403).end();
    });

    it('should allow admin to get tenants for other landlords listing', function * () {
      yield this.adminClient.getTenants(this.createdListing.id).expect(200).end();
    });

    it('should return 404 when requesting teants for non-existing listing', function * () {
      yield this.apiClient.getTenants(1000000).expect(404).end();
    });
  });

  describe('DELETE Listing tenants', function () {
    let tenants;

    before(function * () {
      const getResponse = yield this.apiClient.getTenants(this.createdListing.id).expect(200).end();
      tenants = getResponse.body;
    });

    it('should not allow to delete tenants for other landlords listing', function * () {
      yield this.otherApiClient.removeTenant(this.createdListing.id, tenants[0].id).expect(403).end();
    });

    it('should return 404 when trying to delete non-existing teants ', function * () {
      yield this.apiClient.removeTenant(this.createdListing.id, 1000000).expect(404).end();
    });

    it('should succesfully delete a tenant', function * () {
      yield this.apiClient.removeTenant(this.createdListing.id, tenants[0].id).expect(204).end();
      const getResponse = yield this.apiClient.getTenants(this.createdListing.id).expect(200).end();
      __.assertThat(getResponse.body, __.not(__.hasItem(__.hasProperty('id', tenants[0].id))));
    });

    it('should allow admin to delete tenants for other landlords listing', function * () {
      yield this.adminClient.removeTenant(this.createdListing.id, tenants[1].id).expect(204).end();
      const getResponse = yield this.apiClient.getTenants(this.createdListing.id).expect(200).end();
      __.assertThat(getResponse.body, __.not(__.hasItem(__.hasProperty('id', tenants[1].id))));
    });
  });
});
