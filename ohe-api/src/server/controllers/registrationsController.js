'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventRegistrationsService');

function* post() {
  const eventId= this.request.body.open_house_event_id;
  let user = this.request.body.user_details;
  user.user_id = this.request.user.id;
  logger.debug({event_id: eventId, registered_user_id: user.userId}, 'Registering to an open house event...');
  
  const result = yield service.register(eventId, user);
  logger.info({event_id: eventId, registered_user_id: user.userId}, 'Registration created');
  this.response.status = 201;
  this.response.body = result;
}

function* remove() {
  const id = this.params.id;
  logger.debug({event_id: id}, 'Deleting registration...');
  yield service.unregister(id);
  logger.info({event_id: id}, 'Registration deleted');
  this.response.status = 200;
}

module.exports = {
  post: post,
  delete:remove
};
