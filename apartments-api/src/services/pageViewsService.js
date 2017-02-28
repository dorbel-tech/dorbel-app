'use strict';
const shared = require('dorbel-shared');
const analyticsProvider = require('../providers/googleAnalyticsProvider');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');

const logger = shared.logger.getLogger(module);

analyticsProvider.init();

function * getPageViewsForListings(listingIds) {
  logger.trace({ listingIds }, 'getting page views');

  return yield listingIds.map(getPageViewForSingleListing);
}

function * getPageViewForSingleListing(listingId) {
  const listing = yield listingRepository.getById(listingId);
  if (!listing) { return; }

  return yield analyticsProvider.getPageViews(getUrlsForListing(listing));
}

function getUrlsForListing(listing) {
  const urls = [ `/apartments/${listing.id}` ];

  if (listing.slug) {
    urls.push(`/apartments/${listing.slug}`);
  }

  return urls;
}

module.exports = {
  getPageViewsForListings
};
