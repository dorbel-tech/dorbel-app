'use strict';
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventFollowersRepository');

function* getByListing(listingId){
  return yield repository.findByListingId(listingId);
}

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

  notificationService.send(notificationService.eventType.OHE_FOLLOWED, {
    listing_id: listingId,
    user_uuid: userId
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

  notificationService.send(notificationService.eventType.OHE_UNFOLLOWED, {
    listing_id: existingFollower.listing_id,
    user_uuid: existingFollower.following_user_id
  });

  return result;
}

module.exports = {
  getByListing,
  follow,
  unfollow
};
