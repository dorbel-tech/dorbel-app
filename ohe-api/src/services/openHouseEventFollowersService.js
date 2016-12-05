'use strict';
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
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

function* follow(eventId, userId) {
  let existingEvent = yield openHouseEventsFinderService.find(eventId);
  if (existingEvent.followers) {
    existingEvent.followers.forEach(function (follower) {
      if (follower.user_id == userId) {
        throw new OpenHouseEventFollowerValidationError(eventId, userId, 'user already follows this event');
      }
    });
  }

  const follower = {
    open_house_event_id: eventId,
    user_id: userId,
    is_active: true
  };

  const result = yield repository.createFollower(follower);

  notificationService.send('OHE_FOLLOW', {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
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

  notificationService.send('OHE_UNFOLLOW', {
    event_id: existingFollower.id,
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
