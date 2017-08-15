'use strict';
const filterService = require('../../services/filterService');

async function post(ctx) {
  ctx.response.body = await filterService.create(ctx.request.body, ctx.request.user);
  ctx.response.status = 200;
}

async function get(ctx) {
  let filters;
  if (ctx.request.query.matchingListingId) {
    filters = await filterService.getFilterByMatchedListing(ctx.request.query.matchingListingId, ctx.request.user);
  } else {
    filters = await filterService.getByUser(ctx.request.user);
  }
  ctx.response.body = filters;
  ctx.response.status = 200;
  return Promise.resolve();
}

async function destory (ctx) {
  const filterId = parseInt(ctx.params.filterId);
  await filterService.destory(filterId, ctx.request.user);
  ctx.response.status = 204;
}

async function put (ctx) {
  const filterId = parseInt(ctx.params.filterId);
  ctx.response.body = await filterService.update(filterId, ctx.request.body, ctx.request.user);
  ctx.response.status = 200;
}

module.exports = {
  get: get,
  delete: destory,
  post,
  put
};
