'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventRegistrationsService');

async function post(ctx) {
  const eventId = ctx.request.body.open_house_event_id;
  let user = ctx.request.body.user_details;
  user.user_id = ctx.request.user.id;
  logger.debug({event_id: eventId, user_uuid: user.user_id}, 'Registering to an open house event...');

  const result = await service.register(eventId, user);
  logger.info({event_id: eventId, user_uuid: user.user_id}, 'Registration created');
  ctx.response.status = 201;
  ctx.response.body = result;
}

async function remove(ctx) {
  const id = ctx.params.id;
  const user = ctx.request.user;
  logger.debug({event_id: id, user_uuid: user.user_id}, 'Deleting registration...');
  await service.unregister(id, user);
  logger.info({event_id: id, user_uuid: user.user_id}, 'Registration deleted');
  ctx.response.status = 200;
}

module.exports = {
  post: post,
  delete:remove
};
