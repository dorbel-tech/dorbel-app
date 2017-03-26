'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const oheService = require('../../services/openHouseEventsService');
const ONE_MINUTE = 60;

function* get() {
  const listingIds = this.params.listingIds.split(',').map(id => parseInt(id));
  const query = this.request.query;

  logger.debug({ listingIds, query }, 'Getting open house events for listings...');
  const result = yield oheService.findByListing(listingIds, this.request.user, query);
  logger.info({ listingIds, eventCount: result.length }, 'Open house events for listings found');

  if (!this.request.user) {
    this.response.set('Cache-Control', 'public, max-age=' + ONE_MINUTE);
  }

  this.response.status = 200;
  this.response.body = result;
}

module.exports = {
  get: get
};
