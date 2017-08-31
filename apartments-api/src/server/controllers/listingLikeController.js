'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ONE_HOUR = 60 * 60;

async function get(ctx) {
  const listing_id = ctx.params.listingId;
  const include_profile = ctx.request.query.include_profile;

  logger.debug({ listing_id }, 'Getting likes by listing...');

  let result = await likeService.getByListing(listing_id, ctx.request.user, include_profile);
  logger.info({ listing_id, likes_count: result.length }, 'Got likes by listing');

  ctx.response.status = 200;

  shared.helpers.headers.setUserConditionalCacheHeader(ctx.request, ctx.response, ONE_HOUR);
  ctx.response.body = result;
}

module.exports = {
  get
};
