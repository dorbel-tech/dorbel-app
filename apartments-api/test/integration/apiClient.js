'use strict';
const app = require('../../src/index.js');
const coSupertest = require('co-supertest');

const USER_PROFILE_HEADER = 'x-user-profile';

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

  getListings() {
    return this.request.get('/v1/listings');
  }

  getSingleListing(id) {
    return this.request.get('/v1/listings/' + id);
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
    return this.request.post('/v1/likes/' + listingId);
  }
  
  unlikeListing(listingId) {
    return this.request.delete('/v1/likes/' + listingId);
  }

  getUserLikes(){
    return this.request.get('/v1/likes/user');
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


module.exports = ApiClient;
