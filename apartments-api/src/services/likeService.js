'use strict';
const likeRepository = require('../apartmentsDb/repositories/likeRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const errors = shared.utils.domainErrors;
const messageBus = shared.utils.messageBus;

function* getListingLikesCount(listingId) {
  return yield likeRepository.getListingTotalLikes(listingId);
}

function* getUserLikes(user) {
  let likeObjects = yield likeRepository.getUserLikes(user);
  return likeObjects.map(item => item.listing_id);
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
  messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, eventType, {
    listing_id: listingId,
    user_uuid: userId,
    is_liked: isLiked
  });
}

function handleSetError(error, listingId, user, isLiked) {
  if (error.name == 'SequelizeForeignKeyConstraintError') {  // hide DB related information in case an error is thrown
    throw new errors.DomainNotFoundError(
      'LikeServiceNonExistingListingError',
      { error, user, listing_id: listingId, is_liked: isLiked },
      `Could not ${isLiked ? 'like' : 'unlike'} listing`
    );
  }
  else {
    throw error;
  }
}

module.exports = {
  getListingLikesCount,
  getUserLikes,
  set
};
