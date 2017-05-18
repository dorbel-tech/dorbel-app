'use strict';
const notificationService = require('./notificationService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventFollowersRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;

function* getByListing(listingId, user, include_profile){
  let followers = yield repository.findByListingId(listingId);
  followers = followers.map(f => f.get({ plain: true }));
  let promises = [];

  // TODO: Missing check for user identity which leads to potential security threat!
  if (include_profile == 'true') {
    // get all the data about the followers
    followers.forEach((follower) => {
      const promiseForUser = userManagement.getPublicProfile(follower.following_user_id)
        .then(user_details => {
          follower.user_details = user_details;
        });
      promises.push(promiseForUser);
    });
  }

  yield promises; // wait for it
  return followers;
}

function* follow(listingId, user) {
  const existingFollowers = yield repository.findByListingId(listingId);
  if (existingFollowers) {
    const alreadyFollow = existingFollowers.filter(function (follower) {
      return follower.following_user_id == user.user_id;
    });

    if (alreadyFollow.length) {
      throw new errors.DomainValidationError('OpenHouseEventFollowerValidationError',
        { listing_id: listingId, user_uuid: user.user_id },
        'המשתמש כבר עוקב אחרי הנכס');
    }
  }

  const follower = {
    listing_id: listingId,
    following_user_id: user.user_id,
    is_active: true
  };

  const result = yield repository.createFollower(follower);
  logger.info({ listing_id: listingId, user_uuid: user.user_id }, 'Listing was followed');

  // TODO: Update user details can be done on client using user token.
  if (user.email) {
    userManagement.updateUserDetails(user.user_id, {
      user_metadata: {
        email: user.email
      }
    });
  }

  notificationService.send(notificationService.eventType.OHE_FOLLOWED, {
    listing_id: listingId,
    user_uuid: user.user_id
  });

  return result;
}

function* unfollow(followId, user) {
  let existingFollower = yield repository.findFollower(followId);
  if (existingFollower == undefined) {
    throw new errors.DomainNotFoundError('OpenHouseEventFollowerNotFoundError',
      { follow_id: followId },
      'עוקב לא קיים');
  }

  userPermissions.validateResourceOwnership(user, existingFollower.following_user_id);

  existingFollower.is_active = false;

  const result = yield repository.updateFollower(existingFollower);
  logger.info({
    listing_id: existingFollower.listing_id,
    user_uuid: existingFollower.following_user_id
  }, 'Listing was unfollowed');

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
