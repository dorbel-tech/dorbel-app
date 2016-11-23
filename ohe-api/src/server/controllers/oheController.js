'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const openHouseEventsService = require('../../services/openHouseEventsService');

function* post() {
  this.response.status = 201;
  logger.debug('Creating new open house event...');
  let newEvent = this.request.body;
  
  let newEventResult = yield openHouseEventsService.create(newEvent);
  logger.info(newEventResult.id, 'Open house event created');
  this.response.status = 201;
  this.response.body = newEventResult;
}

module.exports = {
  post: post
};
