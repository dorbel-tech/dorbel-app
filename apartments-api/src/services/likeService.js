'use strict';
const likeRepository = require('../apartmentsDb/repositories/likeRepository');
const shared = require('dorbel-shared');
const config = shared.config;
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;

function* set(listingId, user, isLiked) {
  try {
    yield likeRepository.set(listingId, user.id, isLiked);
  } catch (err) { // hide DB related information in case an error is thrown
    const errorStr = `Could not ${isLiked ? 'like' : 'unlike'} for listing`;
    logger.error({
      err,
      listing_id: listingId,
      user_uuid: user.id,
      is_liked: isLiked
    }, );
    throw new Error(errorStr);
  }

  logger.info({
    listing_id: listingId,
    user_uuid: user.id,
    is_liked: isLiked
  }, `listing is ${isLiked ? 'liked' : 'unliked'}`);
  
  publishLikeEvent(listingId, user.id, isLiked);
}

function publishLikeEvent(listingId, userId, isLiked) {
  const eventType = isLiked ? messageBus.eventType.APARTMENT_LIKED : messageBus.eventType.APARTMENT_UNLIKED;
  messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), eventType, {
    listing_id: listingId,
    user_uuid: userId,
    is_liked: isLiked
  });
}

module.exports = {
  set
};
