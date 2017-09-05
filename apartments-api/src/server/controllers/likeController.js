'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ONE_HOUR = 60 * 60;

async function get(ctx) {
  const apartmentId = ctx.params.apartmentId;
  const include_profile = ctx.request.query.include_profile;

  logger.debug({ apartment_id: apartmentId }, 'Getting likes by apartment...');

  let result = await likeService.getByApartment(apartmentId, ctx.request.user, include_profile);
  logger.info({ apartment_id: apartmentId, likes_count: result.length }, 'Got likes by listing');

  ctx.response.status = 200;

  shared.helpers.headers.setUserConditionalCacheHeader(ctx.request, ctx.response, ONE_HOUR);
  ctx.response.body = result;
}

async function post(ctx) {
  await handleLikeSet(ctx, true);
}

async function remove(ctx) {
  await handleLikeSet(ctx, false);
}

async function handleLikeSet(ctx, isLiked) {
  const user = ctx.params.tenant || ctx.request.user;
  const apartmentId = ctx.params.apartmentId;
  const data = ctx.request.body;
  await likeService.set(apartmentId, data.listing_id, user, isLiked);
  ctx.response.status = 200;
}

module.exports = {
  get,
  post,
  delete: remove
};
