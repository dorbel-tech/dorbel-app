'use strict';
const coSupertest = require('co-supertest');


class ApiClient {
  constructor(request) {
    this.request = request;
  }

  static * init() {
    const app = require('../../src/server/server.js');
    let request;

    try {
      let server = yield app.runServer();
      request = coSupertest.agent(server);
    }
    catch (err) {
      if (err.code === 'EADDRINUSE') { // server is already up
        request = coSupertest('localhost:' + err.port);
      } else {
        throw err;
      }
    }

    return new ApiClient(request);
  }

  getHomepage() {
    return this.request.get('/');
  }

  getApartment(id) {
    return this.request.get('/apartments/' + id);
  }

  getCities() {
    return this.request.get('/api/apartments/v1/cities');
  }
}

module.exports = ApiClient;
