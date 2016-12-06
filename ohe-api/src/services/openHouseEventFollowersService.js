'use strict';
const notificationService = require('./notificationService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventFollowersRepository');

function OpenHouseEventFollowerValidationError(eventId, userId,message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.eventId = eventId;
  this.userId = userId;
}

function OpenHouseEventFollowerNotFoundError(followId, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.followId = followId;
}

function* follow(listingId, userId) {
  let existingFollowers = yield repository.findByListingId(listingId);
  if (existingFollowers) {
    const alreadyFollow = existingFollowers.filter(function(follower){
      return follower.user_id == userId;
    });

    if(alreadyFollow.length){
      throw new OpenHouseEventFollowerValidationError(listingId, userId, 'user already follows this listing');
    }
  }

  const follower = {
    listing_id: listingId,
    user_id: userId,
    is_active: true
  };

  const result = yield repository.createFollower(follower);

  notificationService.send(notificationService.eventType.OHE_FOLLOW, {
    listing_id: listingId,
    follower_user_id: userId
  });

  return result;
}

function* unfollow(followId) {
  let existingFollower = yield repository.findFollower(followId);
  if (existingFollower == undefined) {
    throw new OpenHouseEventFollowerNotFoundError(followId, 'follower does not exist');
  }
  existingFollower.is_active = false;

  const result = yield repository.updateFollower(existingFollower);

  notificationService.send(notificationService.eventType.OHE_UNFOLLOW, {
    listing_id: existingFollower.listing_id,
    follower_user_id: existingFollower.user_id
  });

  return result;
}

module.exports = {
  follow,
  unfollow,
  OpenHouseEventFollowerValidationError,
  OpenHouseEventFollowerNotFoundError
};
