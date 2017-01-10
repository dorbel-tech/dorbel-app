'use strict';
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventFollowersRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const userManagement = shared.utils.userManagement;

function* getByListing(listingId){
  return yield repository.findByListingId(listingId);
}

function* follow(listingId, user) {
  const existingFollowers = yield repository.findByListingId(listingId);
  if (existingFollowers) {
    const alreadyFollow = existingFollowers.filter(function (follower) {
      return follower.following_user_id == user.user_id;
    });

    if (alreadyFollow.length) {
      throw new errors.DomainValidationError('OpenHouseEventFollowerValidationError',
        { listing_id: listingId, following_user_id: user.user_id },
        'user already follows this listing');
    }
  }

  const follower = {
    listing_id: listingId,
    following_user_id: user.user_id,
    is_active: true
  };

  const result = yield repository.createFollower(follower);
  logger.info(result, 'Listing was followed');

  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(user.user_id, {
    user_metadata: {
      email: user.email
    }
  });  

  notificationService.send(notificationService.eventType.OHE_FOLLOWED, {
    listing_id: listingId,
    user_uuid: user.user_id
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
  logger.info(result, 'Listing was unfollowed');

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
