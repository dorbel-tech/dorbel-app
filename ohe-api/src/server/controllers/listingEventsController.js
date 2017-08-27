'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const oheService = require('../../services/openHouseEventsService');

async function get(ctx) {
  const listingIds = ctx.params.listingIds.split(',').map(id => parseInt(id));
  const query = ctx.request.query;

  logger.debug({ listingIds, query }, 'Getting open house events for listings...');
  const result = await oheService.findByListing(listingIds, ctx.request.user, query);
  logger.info({ listingIds, eventCount: result.length }, 'Open house events for listings found');

  ctx.response.status = 200;
  ctx.response.body = result;
}

module.exports = {
  get: get
};
