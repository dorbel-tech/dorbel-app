'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');

function* get() {
  shared.helpers.headers.setNoCacheHeader(this.response);
  this.response.body = yield likeService.getUserLikes(this.request.user);
}

function* post() {
  yield handleLikeSet(this, true);
}

function* remove() {
  yield handleLikeSet(this, false);
}

function* handleLikeSet(context, isLiked) {
  const user = context.request.user;
  const listingId = context.params.listingId;
  yield likeService.set(listingId, user, isLiked);
  context.response.status = 200;
}

module.exports = {
  get,
  post,
  delete: remove
};
