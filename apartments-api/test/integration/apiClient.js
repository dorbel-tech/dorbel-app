'use strict';
const app = require('../../src/index.js');
const coSupertest = require('co-supertest');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');

const USER_PROFILE_HEADER = 'x-user-profile';
// Integration tests run with static ID as they fill the message queue with app-events
const INTEGRATION_TEST_USER_ID = '36a204fa-41b7-4c87-a759-f8a449abadb8';
const OTHER_INTEGRATION_TEST_USER_ID = '18b5d059-095f-4409-b5ab-4588f08d3a54';
const ADMIN_INTEGRATION_TEST_USER_ID = '1483a989-b560-46c4-a759-12c2ebb4cdbf';

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
    if (query && query.q) { // Fix special character encoding in filter json
      query.q = encodeURIComponent(JSON.stringify(query.q))
        .replace(/%22/g, '"')
        .replace(/%7B/g, '{')
        .replace(/%7D/g, '}')
        .replace(/%3A/g, ':');
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

  likeListing(listingId) {
    return this.request
      .post('/v1/likes/' + listingId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  unlikeListing(listingId) {
    return this.request
      .delete('/v1/likes/' + listingId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  getUserLikes() {
    return this.request
      .get('/v1/likes/user')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  updateUserProfile(data, isAuthenticated=true) {
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

module.exports = ApiClient;
