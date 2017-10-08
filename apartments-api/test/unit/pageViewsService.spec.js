'use strict';
const mockRequire = require('mock-require');
const _ = require('lodash');
const __ = require('hamjest');
const sinon = require('sinon');
const shared = require('dorbel-shared');

describe('Page Views Service', function () {

  before(function () {
    this.mockListings = [
      { id: 123 },
      { id: 456 }
    ];

    this.analyticsProviderMock = {
      getPageViews: sinon.stub().resolves([]),
      init: () => { }
    };

    this.cacheMock = {
      setKey: sinon.stub().resolves()
    };

    mockRequire('../../src/providers/googleAnalyticsProvider', this.analyticsProviderMock);
    shared.utils.cache = this.cacheMock;
    this.pageViewsService = require('../../src/services/pageViewsService');
    mockCacheResults = mockCacheResults.bind(this);
  });

  beforeEach(function () {
    this.cacheMock.getKey = sinon.stub().resolves(); // reset stub with behaviour
    this.analyticsProviderMock.getPageViews.reset();
  });

  after(() => mockRequire.stopAll());

  let mockCacheResults = function (firstCall, secondCall) {
    // we are delaying the promise's resolution here because otherwise the tests return false positivies
    const promiseToResolve = (value) => new Promise(resolve => setImmediate(() => resolve(value)));

    this.cacheMock.getKey
      .onFirstCall().returns(promiseToResolve(firstCall ? JSON.stringify(firstCall) : false))
      .onSecondCall().returns(promiseToResolve(secondCall ? JSON.stringify(secondCall) : false));
  };

  it('Should return listings from cache when available', function* () {
    const cacheResult1 = { views: 777 };
    const cacheResult2 = { views: 666 };
    mockCacheResults(cacheResult1, cacheResult2);

    const result = yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    __.assertThat(result, __.hasProperties({
      [this.mockListings[0].id]: cacheResult1,
      [this.mockListings[1].id]: cacheResult2
    }));

    __.assertThat(this.analyticsProviderMock.getPageViews.called, __.is(false));
  });

  it('should return results from both cache and provider', function * () {
    const cacheResult = { views: 82836 };
    mockCacheResults(cacheResult, false);
    const providerResult = [
      { url: `/apartments/${this.mockListings[1].id}`, views: 99 }
    ];
    this.analyticsProviderMock.getPageViews.resolves(providerResult);

    const results = yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    __.assertThat(results, __.hasProperties({
      [this.mockListings[0].id]: cacheResult,
      [this.mockListings[1].id]: { views: 99 }
    }));
  });
});
