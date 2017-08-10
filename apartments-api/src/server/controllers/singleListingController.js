'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
const ONE_MINUTE = 60;

async function get(ctx) {
  const listingIdOrSlug = ctx.params.listingId;
  const isSlug = isNaN(listingIdOrSlug);

  shared.helpers.headers.setUserConditionalCacheHeader(ctx.request, ctx.response, ONE_MINUTE);

  if (isSlug) {
    const encodedSlug = shared.utils.generic.normalizeSlug(listingIdOrSlug);
    ctx.response.body = await listingService.getBySlug(encodedSlug, ctx.request.user);
  }
  else {
    ctx.response.body = await listingService.getById(listingIdOrSlug, ctx.request.user);
  }
}

async function patchListing(ctx) {
  logger.debug('Updating listing...');
  const listingId = ctx.params.listingId;
  const listing = await listingService.update(listingId, ctx.request.user, ctx.request.body);
  logger.info({ listing_id: listingId }, 'Listing updated');
  ctx.response.status = 200;
  ctx.response.body = listing;
}

module.exports = {
  get: get,
  patchListing // Fleek v2 doesn't support patch so we use explicit operationId (also defined in swagger file)
};

