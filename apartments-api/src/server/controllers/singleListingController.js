'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
const ONE_MINUTE = 60;

function* get() {
  const listingIdOrSlug = this.params.listingIdOrSlug;
  const isSlug = isNaN(listingIdOrSlug);

  shared.helpers.headers.setUserConditionalCacheHeader(this.request, this.response, ONE_MINUTE);

  if (isSlug) {
    const encodedSlug = shared.utils.generic.normalizeSlug(listingIdOrSlug);
    this.response.body = yield listingService.getBySlug(encodedSlug, this.request.user);
  }
  else {
    this.response.body = yield listingService.getById(listingIdOrSlug, this.request.user);
  }
}

function* patch() {
  logger.debug('Updating listing...');
  const listingId = this.params.listingId;
  // TODO : only good for updating listing status 
  const updatedData = this.request.body;
  const listing = yield listingService.updateStatus(listingId, this.request.user, updatedData.status);
  logger.info({ listing_id: listingId, status: updatedData.status }, 'Listing status updated');

  this.response.status = 200;
  this.response.body = listing;
}

module.exports = {
  get: get,
  patch: patch
};

