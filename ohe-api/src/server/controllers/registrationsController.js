'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventRegistrationsService');

function* post() {
  logger.debug('Registering to an open house event...');
  let newRegistrationResult = yield service.register(this.request.body.open_house_event_id, this.request.user.id);
  logger.info('Registration created');
  this.response.status = 201;
  this.response.body = newRegistrationResult;
}

function* remove() {
  logger.debug('Deleting registration...');
  let deletedRegistrationResult = yield service.unregister(this.params.id);
  logger.info(deletedRegistrationResult.id, 'Registration deleted');
  this.response.status = 200;
}

module.exports = {
  post: post,
  delete:remove
};
