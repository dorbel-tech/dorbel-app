'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');

describe('Front Gateway API Integration', function () {
  let apiClient;
  before(function* () {
    apiClient = yield ApiClient.init();
  });

  it('should forward request to apartments API', function* () {
    const response = yield apiClient.get('/api/apartments/v1/cities');
    __.assertThat(response.body, __.is(__.array()));
  });

  it('should redirect /apartments/new to /apartments/new_form', function* () {
    const response = yield apiClient.get('/apartments/new');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', 'https://app.dorbel.com/apartments/new_form')
    }));
  });

  it('should display url without slug', function* () {
    const response = yield apiClient.get('/apartments/1');
    __.assertThat(response, __.hasProperties({
      statusCode: 200,
    }));
  });

  it('should display page with text slug', function* () {
    const response = yield apiClient.get('/apartments/best-apt-test');
    __.assertThat(response, __.hasProperties({
      statusCode: 200,
    }));
  });

  it('should display page with number and text slug', function* () {
    const response = yield apiClient.get('/apartments/123-slug');
    __.assertThat(response, __.hasProperties({
      statusCode: 200,
    }));
  });

  it('should display page url with space in slug', function* () {
    const response = yield apiClient.get('/apartments/123-slug slug');
    __.assertThat(response, __.hasProperties({
      statusCode: 200,
    }));
  });

  it('should return 404 for a non existing listing', function* () {
    const response = yield apiClient.get('/apartments/SomeMadeUpSlug');
    __.assertThat(response, __.hasProperties({
      statusCode: 404,
    }));
  });

  it('should return 404 for a non existing route', function* () {
    const response = yield apiClient.get('/someMadeUpRoute');
    __.assertThat(response, __.hasProperties({
      statusCode: 404,
    }));
  });

  describe('Meta tags', function () {
    function* assertUrls(url, expectedUrl) {
      const $apartmentsPage = yield apiClient.getHtml(url);
      const urlTag = $apartmentsPage.getMetaTag('og:url');
      const canonTag = $apartmentsPage('link[rel="canonical"]').attr('href');
      // not testing the full url - just the path (not the host)
      __.assertThat(urlTag, __.endsWith(expectedUrl || url));
      __.assertThat(canonTag, __.endsWith(expectedUrl || url));
    }

    it('should render apartment page meta tags differently than homepage', function* () {
      const $homepage = yield apiClient.getHtml('/');

      const homepageTitle = $homepage.getMetaTag('og:title');
      const homepageImage = $homepage.getMetaTag('og:image');

      let $apartmentPage = yield apiClient.getHtml('/apartments/1');

      const apartmentPageTitle = $apartmentPage.getMetaTag('og:title');
      const apartmentPageImage = $apartmentPage.getMetaTag('og:image');

      __.assertThat(apartmentPageTitle, __.not(__.equalTo(homepageTitle)));
      __.assertThat(apartmentPageImage, __.not(__.equalTo(homepageImage)));
    });

    it('should render search page urls with own url', function* () {
      yield assertUrls('/search');
    });

    it('should render new apartment form urls with own url', function* () {
      yield assertUrls('/apartments/new_form');
    });

    it('should render apartment urls with slug', function* () {
      const listingData = yield apiClient.get('/api/apartments/v1/listings/1');
      yield assertUrls('/apartments/1', `/apartments/${listingData.body.slug}`);
    });
  });
});

