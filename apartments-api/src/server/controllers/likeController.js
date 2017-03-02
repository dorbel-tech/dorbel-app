'use strict';
const likeService = require('../../services/likeService');

function* post() {
  yield handleLikeSet(this, true);
}

function* remove() {
  yield handleLikeSet(this, false);
}

function* handleLikeSet(context, isLiked) {
  const userId = context.request.user.id;
  const listingId = context.params.listingId;
  yield likeService.set(listingId, userId, isLiked);
  context.response.status = 200;
}

module.exports = {
  post,
  delete: remove
};
