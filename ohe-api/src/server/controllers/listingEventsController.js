'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/listingEventsService');

function* get() {
  logger.debug('Getting open house events for listing...');
  let eventsResult = yield service.list(this.params.id);
  logger.info('Open house events for listing found');
  this.response.status = 200;
  this.response.body = eventsResult;
}

module.exports = {
  get:get
};
