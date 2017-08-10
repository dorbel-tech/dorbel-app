'use strict';
const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const analyticsProvider = require('../providers/googleAnalyticsProvider');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');

const logger = shared.logger.getLogger(module);
const cache = shared.utils.cache;

const PAGE_VIEW_CACHE_TTL_SECONDS = moment.duration(1, 'hours').asSeconds();
const PAGE_VIEW_CACHE_KEY_PREFIX = 'listing_page_views_';

analyticsProvider.init();

async function getPageViewsFromCache(listingIds) {
  const pageViewsFromCache = {};
  const listingIdsNotInCache = [];

  await listingIds.map(async function (listing_id) {
    const cachedViews = await cache.getKey(PAGE_VIEW_CACHE_KEY_PREFIX + listing_id);
    if (cachedViews) {
      logger.trace({ listing_id }, 'page view cache hit');
      pageViewsFromCache[listing_id] = JSON.parse(cachedViews);
    } else {
      logger.trace({ listing_id }, 'page view cache miss');
      listingIdsNotInCache.push(listing_id);
    }
  });

  return { pageViewsFromCache, listingIdsNotInCache };
}

async function getPageViewsFromProvider(listingsIds) {
  const listings = await listingRepository.getSlugs(listingsIds);

  const idsByUrl = getIdsByUrl(listings);
  const urls = Object.keys(idsByUrl);

  const pageViews = await analyticsProvider.getPageViews(urls);

  const viewsFromProvider = {};
  pageViews.forEach(result => {
    const listingId = idsByUrl[result.url];
    viewsFromProvider[listingId] = viewsFromProvider[listingId] || { views: 0 };
    viewsFromProvider[listingId].views += result.views;
  });

  return viewsFromProvider;
}

function getIdsByUrl(listings) {
  // return a map between URL => listing_id (listings with slug will have two entries)
  const idsByUrl = {};
  listings.forEach(listing => {
    idsByUrl[`/apartments/${listing.id}`] = listing.id;
    if (listing.slug) {
      idsByUrl[`/apartments/${listing.slug}`] = listing.id;
    }
  });
  return idsByUrl;
}

function setPageViewsInCache(viewsFromProvider) {
  _.each(viewsFromProvider, (views, id) => {
    cache.setKey(PAGE_VIEW_CACHE_KEY_PREFIX + id, JSON.stringify(views), PAGE_VIEW_CACHE_TTL_SECONDS);
  });
}

async function getPageViewsForListings(listingIds) {
  logger.trace({ listingIds }, 'getting page views');

  const cacheResults = await getPageViewsFromCache(listingIds);

  if (cacheResults.listingIdsNotInCache.length === 0) { // if we got all the listings
    return cacheResults.pageViewsFromCache;
  }

  const viewsFromProvider = await getPageViewsFromProvider(cacheResults.listingIdsNotInCache);

  setPageViewsInCache(viewsFromProvider);

  return _.merge(cacheResults.pageViewsFromCache, viewsFromProvider);
}

module.exports = {
  getPageViewsForListings
};
