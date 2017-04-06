'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
const ONE_MINUTE = 60;

function* get() {
  const listingIdOrSlug = this.params.listingIdOrSlug;
  const isSlug = isNaN(listingIdOrSlug);

  if (!this.request.user) {
    this.response.set('Cache-Control', 'public, max-age=' + ONE_MINUTE);
  }

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
  const listing = yield listingService.update(listingId, this.request.user, this.request.body);
  logger.info({ listing_id: listingId }, 'Listing updated');
  this.response.status = 200;
  this.response.body = listing;
}

module.exports = {
  get: get,
  patch: patch
};

