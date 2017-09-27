'use strict';
const app = require('../../src/index.js');
const coSupertest = require('co-supertest');
const _ = require('lodash');
const fakeObjectGenerator = require('../shared/fakeObjectGenerator');
const utils = require('./utils');
const userIds = utils.userIds;
const USER_PROFILE_HEADER = 'x-user-profile';
const gql = require('graphql-tag');

class ApiClient {
  constructor(request, userProfile) {
    this.request = request;
    this.userProfile = userProfile;
  }

  gql(query, variables) {
    return this.request
      .post('/graphql')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ query: gql(query), variables });
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
    return this.get('/v1/cities');
  }

  getNeighborhoods(cityId) {
    return this.get('/v1/neighborhoods/' + cityId);
  }

  getRelatedListings(id) {
    return this.get('/v1/listings/' + id + '/related');
  }

  getListingPageViews(ids) {
    return this.get('/v1/page_views/listings/' + ids.join(','));
  }

  getHealth() {
    return this.get('/v1/health');
  }

  likeApartment(apartmentId, listingId) {
    return this.post('/v1/apartments/' + apartmentId + '/likes', { listing_id: listingId });
  }

  unlikeApartment(apartmentId, listingId) {
    return this.delete('/v1/apartments/' + apartmentId + '/likes').send({ listing_id: listingId });
  }

  getLikesByApartment(apartmentId) {
    return this.get('/v1/apartments/' + apartmentId + '/likes');
  }

  getLikesByListing(listingId) {
    return this.get('/v1/listings/' + listingId + '/likes');
  }

  getUserLikes() {
    return this.get('/v1/likes/user');
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
    return this.post('/v1/listings/' + listingId + '/tenants', tenant);
  }

  getTenants(listingId) {
    return this.get(`/v1/listings/${listingId}/tenants`);
  }

  removeTenant(listingId, tenantId) {
    return this.delete(`/v1/listings/${listingId}/tenants/${tenantId}`);
  }

  getValidationData(apartment) {
    return this.post('/v1/listings/validation', { apartment });
  }

  getFilters(query) {
    return this.get('/v1/filters', query);
  }

  deleteFilter(filterId) {
    return this.delete(`/v1/filters/${filterId}`);
  }

  createFilter(filter) {
    return this.post('/v1/filters', filter);
  }

  putFilter(filterId, filter) {
    return this.put(`/v1/filters/${filterId}`, filter);
  }

  toggleFiltersEmailNotification(email_notification) {
    return this.gql(`
      mutation toggleFilter($email_notification: Boolean!) {
          toggleFiltersEmail(email_notification: $email_notification)
      }
    `, { email_notification });
  }

  createDocument(document) {
    return this.post('/v1/documents', document);
  }

  getDocuments(query) {
    return this.get('/v1/documents', query);
  }

  deleteDocument(document_id) {
    return this.delete(`/v1/documents/${document_id}`);
  }

  // General purpose methods

  get(url, query) {
    const getRequest = this.makeRequest('get', url);
    query && getRequest.query(query);
    return getRequest;
  }

  delete(url) {
    return this.makeRequest('delete', url);
  }

  post(url, data) {
    return this.makeRequest('post', url).send(data);
  }

  put(url, data) {
    return this.makeRequest('put', url).send(data);
  }

  makeRequest(method, url) {
    const request = this.request[method](url);
    this.userProfile && request.set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
    return request;
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

ApiClient.getInstance = function () {
  return ApiClient.init(fakeObjectGenerator.getFakeUser({
    id: userIds.INTEGRATION_TEST_USER_ID,
    // these are as they are in Auth0
    email: 'int-test-user@dorbel.com',
    first_name: 'Test',
    last_name: 'User',
    phone: '123456789'
  }));
};

ApiClient.getAdminInstance = function () {
  return ApiClient.init(fakeObjectGenerator.getFakeUser({
    id: userIds.ADMIN_INTEGRATION_TEST_USER_ID,
    role: 'admin'
  }));
};

ApiClient.getOtherInstance = function () {
  return ApiClient.init(fakeObjectGenerator.getFakeUser({
    id: userIds.OTHER_INTEGRATION_TEST_USER_ID
  }));
};

ApiClient.getAnonymousInstance = function () {
  return ApiClient.init();
};

module.exports = ApiClient;
