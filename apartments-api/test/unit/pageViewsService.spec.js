'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
const sinon = require('sinon');

describe('Page Views Service', function () {

  before(function () {
    this.mockListing = { id: 123, slug: '123-is-the-best' };

    this.listingRepositoryMock = {
      getById: sinon.stub().resolves(this.mockListing)
    };

    this.analyticsProviderMock = {
      getPageViews: sinon.stub().resolves(200)
    };

    mockRequire('../../src/apartmentsDb/repositories/listingRepository', this.listingRepositoryMock);
    mockRequire('../../src/providers/googleAnalyticsProvider', this.analyticsProviderMock);
    this.pageViewsService = require('../../src/services/pageViewsService');
  });

  after(() => mockRequire.stopAll());

  it('should call analytics provider', function * () {
    var result = yield this.pageViewsService.getPageViewsForListings([this.mockListing.id]);

    __.assertThat(result, __.allOf(
      __.isArray()
    ));

    __.assertThat(this.listingRepositoryMock.called, __.is(true));
  });
});
