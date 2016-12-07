'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const openHouseEventsFinderService = require('../../services/openHouseEventsFinderService');

function* get() {
  const listingId = this.params.id;
  logger.debug({ listing_id: listingId }, 'Getting open house events for listing...');
  const result = yield openHouseEventsFinderService.findByListing(listingId);
  logger.info({ listing_id: listingId, eventCount: result.length }, 'Open house events for listing found');
  this.response.status = 200;
  this.response.body = result;
}

module.exports = {
  get: get
};
