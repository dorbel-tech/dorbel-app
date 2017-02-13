'use strict';
const coSupertest = require('co-supertest');
const config = require('../../src/config');
const net = require('net');

function attemptConnection(port, host) {
  return new Promise((resolve, reject) => {
    net.connect(port, host)
      .once('connect', resolve)
      .once('error', reject);
  });
}

class ApiClient {
  constructor(request) {
    this.request = request;
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
        const app = require('../../src/server/server.js');
        let server = yield app.runServer();
        request = coSupertest.agent(server);
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
