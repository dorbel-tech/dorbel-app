'use strict';

const app = require('../../src/index.js');
const coSupertest = require('co-supertest');

const USER_PROFILE_HEADER = 'x-user-profile';

class ApiClient {
  constructor(request, userProfile) {
    this.request = request;
    this.userProfile = userProfile;
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
      .put('/v1/event')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send(existingEvent);
  }

  deleteEvent(existingEventId) {
    return this.request
      .delete('/v1/event/' + existingEventId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  createNewRegistration(existingEventId) {
    return this.request
      .post('/v1/event/registration')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send({'open_house_event_id': existingEventId});
  }

  deleteRegistration(registrationId) {
    return this.request
      .delete('/v1/event/registration/' + registrationId)
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile));
  }

  createNewFollower(existingEventId) {
    return this.request
      .post('/v1/event/follow')
      .set(USER_PROFILE_HEADER, JSON.stringify(this.userProfile))
      .send({'open_house_event_id': existingEventId});
  }

  deleteFollower(followId) {
    return this.request
      .delete('/v1/event/follow/' + followId)
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


module.exports = ApiClient;
