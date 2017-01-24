'use strict';
const ApiClient = require('./apiClient.js');
const cheerio = require('cheerio');
const __ = require('hamjest');

describe('Front Gateway API Integration', function () {
  before(function * () {
    this.apiClient = yield ApiClient.init();
  });

  it('should render apartment meta tags differently than homepage', function * () {
    const homepage = yield this.apiClient.getHomepage();
    const $homepage = cheerio.load(homepage.text);

    const homepageTitle = $homepage('meta[property="og:title"]').attr('content');
    const homepageImage = $homepage('meta[property="og:image"]').attr('content');

    let apartmentPage = yield this.apiClient.getApartment(1);
    let $apartmentPage = cheerio.load(apartmentPage.text);

    const apartmentPageTitle = $apartmentPage('meta[property="og:title"]').attr('content');
    const apartmentPageImage = $apartmentPage('meta[property="og:image"]').attr('content');

    __.assertThat(apartmentPageTitle, __.not(__.equalTo(homepageTitle)));
    __.assertThat(apartmentPageImage, __.not(__.equalTo(homepageImage)));
  });

  it('should forward request to apartments API', function * () {
    const response = yield this.apiClient.getCities();
    __.assertThat(response.body, __.is(__.array()));
  });

});
