'use strict';
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventFollowersRepository');

function* follow(listingId, userId) {
  const existingFollowers = yield repository.findByListingId(listingId);
  if (existingFollowers) {
    const alreadyFollow = existingFollowers.filter(function (follower) {
      return follower.following_user_id == userId;
    });

    if (alreadyFollow.length) {
      throw new errors.DomainValidationError('OpenHouseEventFollowerValidationError',
        { listing_id: listingId, following_user_id: userId },
        'user already follows this listing');
    }
  }

  const follower = {
    listing_id: listingId,
    following_user_id: userId,
    is_active: true
  };

  const result = yield repository.createFollower(follower);

  notificationService.send(notificationService.eventType.OHE_FOLLOW, {
    listing_id: listingId,
    following_user_id: userId
  });

  return result;
}

function* unfollow(followId) {
  let existingFollower = yield repository.findFollower(followId);
  if (existingFollower == undefined) {
    throw new errors.DomainNotFoundError('OpenHouseEventFollowerNotFoundError',
      { follow_id: followId },
      'follower does not exist');
  }
  
  existingFollower.is_active = false;

  const result = yield repository.updateFollower(existingFollower);

  notificationService.send(notificationService.eventType.OHE_UNFOLLOW, {
    listing_id: existingFollower.listing_id,
    following_user_id: existingFollower.following_user_id
  });

  return result;
}

module.exports = {
  follow,
  unfollow
};
