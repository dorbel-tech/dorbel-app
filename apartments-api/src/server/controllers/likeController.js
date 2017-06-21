'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const ONE_HOUR = 60 * 60;

function* get() {
  const apartmentId = this.params.apartmentId;
  const include_profile = this.request.query.include_profile;

  logger.debug({ apartment_id: apartmentId }, 'Getting likes by apartment...');

  let result = yield likeService.getByApartment(apartmentId, this.request.user, include_profile);
  logger.info({ apartment_id: apartmentId, likes_count: result.length }, 'Got likes by listing');

  this.response.status = 200;

  shared.helpers.headers.setUserConditionalCacheHeader(this.request, this.response, ONE_HOUR);
  this.response.body = result;
}

function* post() {
  yield handleLikeSet(this, true);
}

function* remove() {
  yield handleLikeSet(this, false);
}

function* handleLikeSet(context, isLiked) {
  const user = context.request.user;
  const apartmentId = context.params.apartmentId;
  const data = context.request.body;
  yield likeService.set(apartmentId, data.listing_id, user, isLiked);
  context.response.status = 200;
}

module.exports = {
  get,
  post,
  delete: remove
};
