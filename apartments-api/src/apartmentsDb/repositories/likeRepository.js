'use strict';
const db = require('../dbConnectionProvider');

function* isLiked(listingId, user) {
  let res = yield db.models.like.findOne({
    where: {
      listing_id: listingId,
      liked_user_id: user.id,
      is_active: true
    },
    raw: true // readonly get - no need for full sequlize instances
  });

  return !!res;
}

function* set(listingId, userId, isLiked) {
  yield db.models.like.upsert({
    listing_id: listingId,
    liked_user_id: userId,
    is_active: isLiked
  });
}

function* getUserLikes(user) {
  return yield db.models.like.findAll({
    where: {
      liked_user_id: user.id,
      is_active: true
    },
    attributes: ['listing_id'],
    raw: true
  });
}

module.exports = {
  getUserLikes,
  isLiked,
  set
};
