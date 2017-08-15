'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const openHouseEventsService = require('../../services/openHouseEventsService');
const openHouseEventsFinderService = require('../../services/openHouseEventsFinderService');
const ONE_MINUTE = 60;

async function get(ctx) {
  const id = ctx.params.id;
  logger.debug({event_id: id}, 'Getting open house event...');
  const result = await openHouseEventsFinderService.find(id);
  logger.info({event_id: id}, 'Open house event found');
  ctx.response.status = 200;

  shared.helpers.headers.setUserConditionalCacheHeader(ctx.request, ctx.response, ONE_MINUTE);
  ctx.response.body = result;
}

async function post(ctx) {
  const data = ctx.request.body;
  data.publishing_user_id = ctx.request.user.id;
  logger.debug({data}, 'Creating new open house event...');
  const result = await openHouseEventsService.create(data, ctx.request.user);
  logger.info({event_id: result.id}, 'Open house event created');
  ctx.response.status = 201;
  ctx.response.body = result;
}

async function put(ctx) {
  const data = ctx.request.body;
  const id = parseInt(ctx.params.id);
  const user = ctx.request.user;
  logger.debug({id, data}, 'Updating open house event...');
  const result = await openHouseEventsService.update(id, data, user);
  logger.info({event_id: result.id}, 'Open house event updated');
  ctx.response.status = 200;
  ctx.response.body = result;
}

async function remove(ctx) {
  const id = ctx.params.id;
  const user = ctx.request.user;
  logger.debug({event_id: id}, 'Deleting open house event...');
  await openHouseEventsService.remove(id, user);
  logger.info(id, 'Open house event deleted');
  ctx.response.status = 200;
}

module.exports = {
  get: get,
  post: post,
  put: put,
  delete: remove
};
