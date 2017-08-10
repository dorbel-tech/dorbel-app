'use strict';
const listingUsersService = require('../../services/listingUsersService');

async function post(ctx) {
  const listingId = ctx.params.listingId;
  const userToCreate = ctx.request.body;

  ctx.response.body = await listingUsersService.create(listingId, userToCreate, ctx.request.user);
  ctx.response.status = 201;
}

async function get(ctx) {
  const listingId = ctx.params.listingId;
  ctx.response.body = await listingUsersService.get(listingId, ctx.request.user);
  ctx.response.status = 200;
}

async function remove(ctx) {
  const listingUserId = ctx.params.listingUserId;
  await listingUsersService.remove(listingUserId, ctx.request.user);
  ctx.response.status = 204;
}

module.exports = {
  post,
  get: get,
  delete: remove
};
