'use strict';
const pageViewsService = require('../../services/pageViewsService');
const shared = require('dorbel-shared');
const ONE_HOUR = 60 * 60;

async function get(ctx) {
  const listingIds = ctx.params.listingIds.split(',');
  shared.helpers.headers.setCacheHeader(ctx.response, ONE_HOUR);
  ctx.response.body = await pageViewsService.getPageViewsForListings(listingIds);
}

module.exports = {
  get: get
};
