'use strict';
const likeService = require('../../services/likeService');

function* get() {
  this.response.set('Cache-Control', 'no-cache');
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
