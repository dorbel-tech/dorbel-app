'use strict';
const coSupertest = require('co-supertest');
const net = require('net');
const cheerio = require('cheerio');
const fakeObjectGenerator = require('./fakeObjectGenerator');

const USER_PROFILE_HEADER = 'x-user-profile';
const ADMIN_INTEGRATION_TEST_USER_ID = '1483a989-b560-46c4-a759-12c2ebb4cdbf';

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

  // TODO: This is a quick solution - We should consider moving apiClient to dorbel-shared
  * createListingWithSlug(slug) {
    const listing = fakeObjectGenerator.getFakeListing();
    listing.slug = slug;

    const userProfile = fakeObjectGenerator.getFakeUser({
      id: ADMIN_INTEGRATION_TEST_USER_ID,
      role: 'admin'
    });

    const createListingResponse = yield this.request.post('/api/apartments/v1/listings')
      .set(USER_PROFILE_HEADER, JSON.stringify(userProfile))
      .send(listing);

    yield this.request.patch('/v1/listings/' + createListingResponse.id)
      .set(USER_PROFILE_HEADER, JSON.stringify(userProfile))
      .send({ status: 'listed' });

    return createListingResponse.body;
  }

  * getHtml(url) {
    const response = yield this.get(url);
    const $html = cheerio.load(response.text);
    return this.extendCheerioOutput($html);
  }

}

module.exports = ApiClient;
