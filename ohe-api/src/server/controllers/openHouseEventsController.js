'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const openHouseEventsService = require('../../services/openHouseEventsService');
const openHouseEventsFinderService = require('../../services/openHouseEventsFinderService');

function* get() {
  const id = this.params.id;
  logger.debug({event_id: id}, 'Getting  open house event...');
  const result = yield openHouseEventsFinderService.find(id);
  logger.info({event_id: id}, 'Open house event found');
  this.response.status = 200;
  this.response.body = result;
}

function* post() {
  const data = this.request.body;
  logger.debug(data, 'Creating new open house event...');
  const result = yield openHouseEventsService.create(data);
  logger.info({event_id: result.id}, 'Open house event created');
  this.response.status = 201;
  this.response.body = result;
}

function* put() {
  const data = this.request.body;
  logger.debug(data, 'Updating open house event...');
  const result = yield openHouseEventsService.update(data);
  logger.info({event_id: result.id}, 'Open house event updated');
  this.response.status = 200;
  this.response.body = result;
}

function* remove() {
  const id = this.params.id;
  logger.debug({event_id: id}, 'Deleting open house event...');
  yield openHouseEventsService.remove(id);
  logger.info(id, 'Open house event deleted');
  this.response.status = 200;
}

module.exports = {
  get:get,
  post: post,
  put: put,
  delete:remove
};
