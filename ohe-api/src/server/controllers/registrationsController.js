'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventRegistrationsService');

function* post() {
  const eventId = this.request.body.open_house_event_id;
  let user = this.request.body.user_details;
  user.user_id = this.request.user.id;
  logger.debug({event_id: eventId, user_uuid: user.user_id}, 'Registering to an open house event...');
  
  const result = yield service.register(eventId, user);
  logger.info({event_id: eventId, user_uuid: user.user_id}, 'Registration created');
  this.response.status = 201;
  this.response.body = result;
}

function* remove() {
  const id = this.params.id;
  const user = this.request.user;
  logger.debug({event_id: id, user_uuid: user.user_id}, 'Deleting registration...');
  yield service.unregister(id, user);
  logger.info({event_id: id, user_uuid: user.user_id}, 'Registration deleted');
  this.response.status = 200;
}

module.exports = {
  post: post,
  delete:remove
};
