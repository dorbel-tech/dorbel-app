'use strict';
const app = require('../../src/index.js');
const coSupertest = require('co-supertest');

class ApiClient{
  constructor(request) {
    this.request = request;
  }

  getHealth() {
    return this.request.get('/v1/health');
  }

  static * init() {
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

    return new ApiClient(request);
  }
}


module.exports = ApiClient;
