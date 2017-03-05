'use strict';
const db = require('../dbConnectionProvider');

function* check(listingId, user) {
  let res = yield db.models.like.findOne({
    where: {
      listing_id: listingId,
      user_id: user.id,
      is_active: true
    },
    raw: true // readonly get - no need for full sequlize instances
  });

  return !!res ;
}

function* set(listingId, userId, isLiked) {
  yield db.models.like.upsert({
    listing_id: listingId,
    user_id: userId,
    is_active: isLiked
  });
}

module.exports = {
  check,
  set
};
