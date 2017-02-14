'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const oheService = require('../../services/openHouseEventsService');

function* get() {
  const listingId = this.params.id;
  logger.debug({ listingId }, 'Getting open house events for listing...');
  const result = yield oheService.findByListing(listingId, this.request.user);
  logger.info({ listingId, eventCount: result.length }, 'Open house events for listing found');
  this.response.status = 200;
  this.response.body = result;
}

module.exports = {
  get: get
};
