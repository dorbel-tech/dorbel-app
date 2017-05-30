'use strict';
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const likeRepository = require('../apartmentsDb/repositories/likeRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const errors = shared.utils.domainErrors;
const messageBus = shared.utils.messageBus;
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;

function* getUserLikes(user) {
  let likeObjects = yield likeRepository.getUserLikes(user);
  return likeObjects.map(item => item.listing_id);
}

function* getByListing(listingId, user, include_profile) {
  let likes = yield likeRepository.findByListingId(listingId);
  likes = likes.map(f => f.get({ plain: true }));
  let promises = [];

  if (include_profile == 'true') {
    const listing = yield listingRepository.getById(listingId);
    if (userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
      // Get all the data about who liked a listing.
      likes.forEach((like) => {
        const promiseForUser = userManagement.getPublicProfile(like.following_user_id)
          .then(user_details => { like.user_details = user_details; });
        promises.push(promiseForUser);
      });
    }
  }

  yield promises; // wait for it
  return likes;
}

function* set(listingId, user, isLiked) {
  try {
    yield likeRepository.set(listingId, user.id, isLiked);
  } catch (error) {
    handleSetError(error, listingId, user, isLiked);
  }

  logger.info({
    listing_id: listingId,
    user_uuid: user.id,
    is_liked: isLiked
  }, `listing is ${isLiked ? 'liked' : 'unliked'}`);

  publishLikeEvent(listingId, user.id, isLiked);
}

function publishLikeEvent(listingId, userId, isLiked) {
  const eventType = isLiked ? messageBus.eventType.LISTING_LIKED : messageBus.eventType.LISTING_UNLIKED;
  if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
    messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, eventType, {
      listing_id: listingId,
      user_uuid: userId,
      is_liked: isLiked
    });
  }
}

function handleSetError(error, listingId, user, isLiked) {
  if (error.name == 'SequelizeForeignKeyConstraintError') { // hide DB related information in case an error is thrown
    throw new errors.DomainNotFoundError(
      'LikeServiceNonExistingListingError', {
        error,
        user,
        listing_id: listingId,
        is_liked: isLiked
      },
      `Could not ${isLiked ? 'like' : 'unlike'} listing`
    );
  } else {
    throw error;
  }
}

module.exports = {
  getUserLikes,
  getByListing,
  set
};
