'use strict';
const app = require('../../src/index.js');
const coSupertest = require('co-supertest');
const _ = require('lodash');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

const USER_PROFILE_HEADER = 'x-user-profile';
// Integration tests run with static ID as they fill the message queue with app-events
const INTEGRATION_TEST_USER_ID = '36a204fa-41b7-4c87-a759-f8a449abadb8';
const OTHER_INTEGRATION_TEST_USER_ID = '40031759-daa4-4b5d-ad69-5f7760894c80';
const ADMIN_INTEGRATION_TEST_USER_ID = 'ecdf7910-2055-4553-9ccd-d730e1e4e73e';

class ApiClient {
  constructor(request, userProfile) {
    this.request = request;
    this.userProfile = userProfile;
  }

  createListing(newListing) {
    return this.request
      .post('/v1/listings')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(newListing);
  }

  getListings(query, isAuthenticated) {
    query = _.cloneDeep(query);
    if (query && query.q) { // Fix special character encoding in filter json
      query.q = encodeURIComponent(JSON.stringify(query.q))
        .replace(/%22/g, '"')
        .replace(/%7B/g, '{')
        .replace(/%7D/g, '}')
        .replace(/%3A/g, ':')
        .replace(/%2C/g, ',');
    }

    if (isAuthenticated) {
      return this.request.get('/v1/listings')
        .query(query)
        .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
    }
    else {
      return this.request.get('/v1/listings')
        .query(query);
    }
  }

  getSingleListing(id, isAuthenticated) {
    if (isAuthenticated) { // TODO: This is repeated alot... let's find a better way when possible
      return this.request.get('/v1/listings/' + id)
        .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
    }
    else {
      return this.request.get('/v1/listings/' + id);
    }
  }

  patchListing(id, data) {
    return this.request.patch('/v1/listings/' + id)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(data);
  }

  getCities() {
    return this.request.get('/v1/cities');
  }

  getNeighborhoods(cityId) {
    return this.request.get('/v1/neighborhoods/' + cityId);
  }

  getRelatedListings(id) {
    return this.request.get('/v1/listings/' + id + '/related');
  }

  getListingPageViews(ids) {
    return this.request.get('/v1/page_views/listings/' + ids.join(','));
  }

  getHealth() {
    return this.request.get('/v1/health');
  }

  likeApartment(apartmentId) {
    return this.request
      .post('/v1/likes/' + apartmentId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  unlikeApartment(apartmentId) {
    return this.request
      .delete('/v1/likes/' + apartmentId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  getLikesByApartment(apartmentId) {
    return this.request
      .get('/v1/likes/' + apartmentId);
  }

  getLikesByListing(listingId) {
    return this.request
      .get('/v1/likes/by-listing/' + listingId);
  }

  getUserLikes() {
    return this.request
      .get('/v1/likes/user')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  updateUserProfile(data, isAuthenticated = true) {
    return isAuthenticated ?
      this.request
        .patch('/v1/user-profile')
        .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
        .send(data)
      :
      this.request
        .patch('/v1/user-profile')
        .send(data);
  }

  postTenant(listingId, tenant) {
    return this.request
      .post('/v1/listings/' + listingId + '/tenants')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(tenant);
  }

  getTenants(listingId) {
    return this.request
      .get(`/v1/listings/${listingId}/tenants`)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  removeTenant(listingId, tenantId) {
    return this.request
      .delete(`/v1/listings/${listingId}/tenants/${tenantId}`)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  getValidationData(apartment) {
    return this.request
      .post('/v1/listings/validation')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send({apartment});
  }

  getFilters() {
    return this.request
      .get('/v1/filters')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  deleteFilter(filterId) {
    return this.request
      .delete(`/v1/filters/${filterId}`)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  createFilter(filter) {
    return this.request
      .post('/v1/filters')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(filter);
  }

  putFilter(filterId, filter) {
    return this.request
      .put(`/v1/filters/${filterId}`)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(filter);
  }

  static * init(userProfile) {
    let request;

    try {
      let server = yield app.bootstrap();
      request = coSupertest.agent(server);
    }
    catch (err) {
      if (err.code === 'EADDRINUSE') { // server is already up
        request = coSupertest('localhost:' + err.port);
      } else {
        throw err;
      }
    }

    return new ApiClient(request, userProfile);
  }
}

ApiClient.getInstance = function() {
  return ApiClient.init(fakeObjectGenerator.getFakeUser({
    id: INTEGRATION_TEST_USER_ID,
    // these are as they are in Auth0
    email: 'int-test-user@dorbel.com',
    first_name: 'Test',
    last_name: 'User',
    phone: '123456789'
  }));
};

ApiClient.getAdminInstance = function() {
  return ApiClient.init(fakeObjectGenerator.getFakeUser({
    id: ADMIN_INTEGRATION_TEST_USER_ID,
    role: 'admin'
  }));
};

ApiClient.getOtherInstance = function() {
  return ApiClient.init(fakeObjectGenerator.getFakeUser({
    id: OTHER_INTEGRATION_TEST_USER_ID
  }));
};

ApiClient.getAnonymousInstance = function () {
  return ApiClient.init();
};

module.exports = ApiClient;
