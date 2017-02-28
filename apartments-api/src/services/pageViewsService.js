'use strict';
const _ = require('lodash');
const shared = require('dorbel-shared');
const analyticsProvider = require('../providers/googleAnalyticsProvider');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');

const logger = shared.logger.getLogger(module);
const cache = shared.utils.cache;

const PAGE_VIEW_CACHE_TTL_SECONDS = 100;

analyticsProvider.init();

function * getPageViewsForListings(listingIds) {
  logger.trace({ listingIds }, 'getting page views');

  const viewsFromCache = {};
  const listingsNotInCache = [];

  yield listingIds.map(function * (listing_id) {
    const cachedViews = yield cache.getKey('listing_page_views_' + listing_id);
    if (cachedViews) {
      logger.trace({ listing_id }, 'page view cache hit');
      viewsFromCache[listing_id] = JSON.parse(cachedViews);
    } else {
      logger.trace({ listing_id }, 'page view cache miss');
      listingsNotInCache.push(listing_id);
    }
  });

  if (listingsNotInCache.length === 0) {
    return viewsFromCache;
  }

  const listings = yield listingRepository.getSlugs(listingsNotInCache);

  const urls = [];
  const idsByUrl = {};
  listings.forEach(listing => {
    const idUrl = `/apartments/${listing.id}`;
    urls.push(idUrl);
    idsByUrl[idUrl] = listing.id;

    if (listing.slug) {
      const slugUrl = `/apartments/${listing.slug}`;
      urls.push(slugUrl);
      idsByUrl[slugUrl] = listing.id;
    }
  });

  const pageViewsByUrl = yield analyticsProvider.getPageViews(urls);
  const viewsFromProvider = {};

  pageViewsByUrl.forEach(result => {
    const listingId = idsByUrl[result.url];
    viewsFromProvider[listingId] = viewsFromProvider[listingId] || { views: 0 };
    viewsFromProvider[listingId].views += result.views;
  });

  _.each(viewsFromProvider, (views, id) => {
    cache.setKey('listing_page_views_' + id, JSON.stringify(views), PAGE_VIEW_CACHE_TTL_SECONDS);
  });

  return _.merge(viewsFromProvider, viewsFromCache);
}

module.exports = {
  getPageViewsForListings
};
