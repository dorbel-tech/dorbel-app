'use strict';
const coSupertest = require('co-supertest');
const net = require('net');
const cheerio = require('cheerio');

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
    const serverPort = process.env.PORT || 3001;

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

  extendCheerioOutput($html) {
    $html.getMetaTag = function (id) {
      return $html(`meta[property="${id}"]`).attr('content');
    };

    return $html;
  }

  get(url) {
    return this.request.get(url);
  }

  * getHtml (url) {
    const response = yield this.get(url);
    const $html = cheerio.load(response.text);
    return this.extendCheerioOutput($html);
  }

}

module.exports = ApiClient;
