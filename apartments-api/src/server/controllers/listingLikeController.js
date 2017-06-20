'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ONE_HOUR = 60 * 60;

function* get() {
  const listingId = this.params.listingId;
  const include_profile = this.request.query.include_profile;

  logger.debug({ listing_id: listingId }, 'Getting likes by listing...');

  let result = yield likeService.getByListing(listingId, this.request.user, include_profile);
  logger.info({ listing_id: listingId, likes_count: result.length }, 'Got likes by listing');

  this.response.status = 200;

  shared.helpers.headers.setUserConditionalCacheHeader(this.request, this.response, ONE_HOUR);
  this.response.body = result;
}

module.exports = {
  get,
};
