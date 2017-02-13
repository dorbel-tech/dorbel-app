'use strict';
const coSupertest = require('co-supertest');
const net = require('net');
const USER_PROFILE_HEADER = 'x-user-profile';

function attemptConnection(port, host) {
  return new Promise((resolve, reject) => {
    net.connect(port, host)
      .once('connect', resolve)
      .once('error', reject);
  });
}

class ApiClient {
  constructor(request, userProfile) {
    this.request = request;
    this.userProfile = userProfile;
  }

  static * init() {
    let request;

    const serverHost = '127.0.0.1';
    const serverPort = config.get('PORT');

    try {
      // try a running server first
      yield attemptConnection(serverPort, serverHost);
      request = coSupertest(`${serverHost}:${serverPort}`);
    }
    catch (err) {
      if (err.code === 'ECONNREFUSED') { // server is not up
        const app = require('../../src/index.js');
        let server = yield app.runServer();
        request = coSupertest.agent(server);
      } else {
        throw err;
      }
    }

    return new ApiClient(request);
  }

  findEventsByListing(listingId) {
    return this.request
      .get('/v1/events/by-listing/' + listingId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  findEvent(existingEventId) {
    return this.request
      .get('/v1/event/' + existingEventId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  createNewEvent(newEvent) {
    return this.request
      .post('/v1/event')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(newEvent);
  }

  updateEvent(existingEvent) {
    return this.request
      .put('/v1/event/' + existingEvent.id)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(existingEvent);
  }

  deleteEvent(existingEventId) {
    return this.request
      .delete('/v1/event/' + existingEventId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  createNewRegistration(existingEventId, user) {
    return this.request
      .post('/v1/event/registration')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send({
        open_house_event_id: existingEventId,
        user_details: user
      });
  }

  deleteRegistration(existingEventId) {
    return this.request
      .delete('/v1/event/registration/' + existingEventId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  getFollowersByListing(listingId) {
    return this.request
      .get('/v1/followers/by-listing/' + listingId);
  }

  createNewFollower(listingId, follower) {
    return this.request
      .post('/v1/follower')
      .set(USER_PROFILE_HEADER, JSON.stringify(follower))
      .send({
        listing_id: listingId
      });
  }

  deleteFollower(followId, follower) {
    return this.request
      .delete('/v1/follower/' + followId)
      .set(USER_PROFILE_HEADER, JSON.stringify(follower));
  }
}


module.exports = ApiClient;
