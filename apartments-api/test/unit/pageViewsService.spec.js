'use strict';
const mockRequire = require('mock-require');
const _ = require('lodash');
const __ = require('hamjest');
const sinon = require('sinon');
const shared = require('dorbel-shared');

describe('Page Views Service', function () {

  before(function () {
    this.mockListings = [
      { id: 123, slug: '123-is-the-best' },
      { id: 456, slug: 'no-456-is-better' }
    ];

    this.listingRepositoryMock = {
      getSlugs: sinon.spy((ids) => Promise.resolve(this.mockListings.filter(l => ids.includes(l.id))))
    };

    this.analyticsProviderMock = {
      getPageViews: sinon.stub().resolves([]),
      init: () => {}
    };

    this.cacheMock = {
      setKey: sinon.stub().resolves()
    };

    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('../../src/providers/googleAnalyticsProvider', this.analyticsProviderMock);
    shared.utils.cache = this.cacheMock;
    this.pageViewsService = require('../../src/services/pageViewsService');
  });

  beforeEach(function () {
    this.cacheMock.getKey = sinon.stub().resolves(); // reset stub with behaviour
    this.listingRepositoryMock.getSlugs.reset();
    this.analyticsProviderMock.getPageViews.reset();
  });

  after(() => mockRequire.stopAll());

  it('Should return listings from cache when available', function * () {
    const cacheResult1 = { views: 777 };
    const cacheResult2 = { views: 666 };
    this.cacheMock.getKey.onFirstCall().resolves(JSON.stringify(cacheResult1))
                         .onSecondCall().resolves(JSON.stringify(cacheResult2));

    const result = yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    __.assertThat(result, __.hasProperties({
      [this.mockListings[0].id]: cacheResult1,
      [this.mockListings[1].id]: cacheResult2
    }));
    __.assertThat(this.listingRepositoryMock.getSlugs.called, __.is(false));
    __.assertThat(this.analyticsProviderMock.getPageViews.called, __.is(false));
  });

  it('should only get listing slugs for listings not in cache', function * () {
    this.cacheMock.getKey.onFirstCall().resolves(JSON.stringify(123))
                         .onSecondCall().resolves(false);

    yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    __.assertThat(this.listingRepositoryMock.getSlugs.calledWith([ this.mockListings[1].id ]), __.is(true));
  });

  it('should call analytics provider with id urls and slug urls', function * () {
    yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    __.assertThat(this.analyticsProviderMock.getPageViews.args[0][0], __.containsInAnyOrder(
      `/apartments/${this.mockListings[0].id}`,
      `/apartments/${this.mockListings[0].slug}`,
      `/apartments/${this.mockListings[1].id}`,
      `/apartments/${this.mockListings[1].slug}`
    ));
  });

  it('should sum results from slug and ids coming from provider and save them to cache', function * () {
    const mockListing = this.mockListings[1];
    const providerResult = [
      { url: `/apartments/${mockListing.id}`, views: 100 },
      { url: `/apartments/${mockListing.slug}`, views: 43 }
    ];
    this.analyticsProviderMock.getPageViews.resolves(providerResult);
    this.cacheMock.getKey.onFirstCall().resolves(JSON.stringify(123))
                         .onSecondCall().resolves(false);

    const results = yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    const expected = { views: 143 };
    __.assertThat(results, __.hasProperty(mockListing.id, expected));
    __.assertThat(this.cacheMock.setKey.calledWith(`listing_page_views_${mockListing.id}`, JSON.stringify(expected)), __.is(true));
  });

  it('should return results from both cache and provider', function * () {
    const cacheResult = { views: 82836 };
    this.cacheMock.getKey.onFirstCall().resolves(JSON.stringify(cacheResult))
                         .onSecondCall().resolves(false);
    const providerResult = [
      { url: `/apartments/${this.mockListings[1].id}`, views: 80 },
      { url: `/apartments/${this.mockListings[1].slug}`, views: 12 }
    ];
    this.analyticsProviderMock.getPageViews.resolves(providerResult);

    const results = yield this.pageViewsService.getPageViewsForListings(_.map(this.mockListings, 'id'));

    __.assertThat(results, __.hasProperties({
      [this.mockListings[0].id]: cacheResult,
      [this.mockListings[1].id]: { views: 92 }
    }));
  });

  it('should correctly handle listing with no slug', function * () {
    const id = 3234;
    this.listingRepositoryMock.getSlugs = sinon.stub().resolves([ { id }]);

    yield this.pageViewsService.getPageViewsForListings([ id ]);

    __.assertThat(this.analyticsProviderMock.getPageViews.args[0][0], __.contains(`/apartments/${id}`));
  });

});
