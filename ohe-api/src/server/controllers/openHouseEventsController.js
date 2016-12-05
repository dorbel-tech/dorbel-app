'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const openHouseEventsService = require('../../services/openHouseEventsService');
const openHouseEventsFinderService = require('../../services/openHouseEventsFinderService');

function* get() {
  logger.debug('Getting  open house event...');
  let eventResult = yield openHouseEventsFinderService.find(this.params.id);
  logger.info(eventResult.id, 'Open house event found');
  this.response.status = 200;
  this.response.body = eventResult;
}

function* post() {
  logger.debug('Creating new open house event...');
  let newEventResult = yield openHouseEventsService.create(this.request.body);
  logger.info(newEventResult.id, 'Open house event created');
  this.response.status = 201;
  this.response.body = newEventResult;
}

function* put() {
  logger.debug('Updating open house event...');
  let updatedEventResult = yield openHouseEventsService.update(this.request.body);
  logger.info(updatedEventResult.id, 'Open house event updated');
  this.response.status = 200;
  this.response.body = updatedEventResult;
}

function* remove() {
  logger.debug('Deleting open house event...');
  let deletedEventResult = yield openHouseEventsService.remove(this.params.id);
  logger.info(deletedEventResult.id, 'Open house event deleted');
  this.response.status = 200;
}

module.exports = {
  get:get,
  post: post,
  put: put,
  delete:remove
};
