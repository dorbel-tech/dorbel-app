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

  it('should redirect /apartments/new to /properties/submit', function* () {
    const response = yield apiClient.get('/apartments/new');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', '/properties/submit')
    }));
  });

  it('should redirect /apartments to /search', function* () {
    const response = yield apiClient.get('/apartments');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', '/search')
    }));
  });

  it('should open property url', function* () {
    const response = yield apiClient.get('/properties/1');
    __.assertThat(response, __.hasProperties({
      statusCode: 200,
    }));
  });

  it('should redirect apartment url to property without slug', function* () {
    const response = yield apiClient.get('/apartments/1');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', '/properties/1')
    }));
  });

  it('should redirect apartment page to property with text slug', function* () {
    const response = yield apiClient.get('/apartments/best-apt-test');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', '/properties/1')
    }));
  });

  it('should redirect apartment page to property with number and text slug', function* () {
    const response = yield apiClient.get('/apartments/123-slug');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', '/properties/2')
    }));
  });

  it('should redirect apartment page url to property with space in slug', function* () {
    const response = yield apiClient.get('/apartments/123-slug slug');
    __.assertThat(response, __.hasProperties({
      statusCode: 301,
      headers: __.hasProperty('location', '/properties/3')
    }));
  });

  it('should return 404 for a non existing property', function* () {
    const response = yield apiClient.get('/properties/SomeMadeUpSlug');
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

      let $apartmentPage = yield apiClient.getHtml('/properties/1');

      const apartmentPageTitle = $apartmentPage.getMetaTag('og:title');
      const apartmentPageImage = $apartmentPage.getMetaTag('og:image');

      __.assertThat(apartmentPageTitle, __.not(__.equalTo(homepageTitle)));
      __.assertThat(apartmentPageImage, __.not(__.equalTo(homepageImage)));
    });

    it('should render search page urls with own url', function* () {
      yield assertUrls('/search');
    });

    it('should render new apartment form urls with own url', function* () {
      yield assertUrls('/properties/submit');
    });

    it('should render apartment urls', function* () {
      const listingData = yield apiClient.get('/api/apartments/v1/listings/1');
      yield assertUrls('/apartments/1', `/apartments/${listingData.body.id}`);
    });
  });
});

