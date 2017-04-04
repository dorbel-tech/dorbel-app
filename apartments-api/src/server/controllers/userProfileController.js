'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

function* patch() {
  const data = this.request.body;
  logger.debug({data}, 'Creating new open house event...');
  const result = yield openHouseEventsService.create(data, this.request.user);
  logger.info({event_id: result.id}, 'Open house event created');
  this.response.status = 201;
  this.response.body = result;
}

module.exports = {
  patch
};
