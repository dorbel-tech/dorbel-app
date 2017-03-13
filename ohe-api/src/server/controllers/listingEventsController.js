'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const oheService = require('../../services/openHouseEventsService');

function* get() {
  const listingIds = this.params.listingIds.split(',').map(id => parseInt(id));
  const query = this.request.query;

  logger.debug({ listingIds, query }, 'Getting open house events for listings...');
  const result = yield oheService.findByListing(listingIds, this.request.user, query);
  logger.info({ listingIds, eventCount: result.length }, 'Open house events for listings found');

  this.response.status = 200;
  this.response.body = result;
}

module.exports = {
  get: get
};
