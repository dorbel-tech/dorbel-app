'use strict';
const likeRepository = require('../apartmentsDb/repositories/likeRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const errors = shared.utils.domainErrors;
const messageBus = shared.utils.messageBus;
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;

async function getUserLikes(user) {
  return likeRepository.getUserLikes(user);
}

async function getByListing(listingId, user, include_profile) {
  let likes = await likeRepository.findByListingId(listingId);
  likes = likes.map(f => f.get({ plain: true }));
  let promises = [];

  if (include_profile == 'true') {
    const listing = await listingRepository.getById(listingId);
    if (userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
      // Get all the data about who liked a listing.
      likes.forEach((like) => {
        const promiseForUser = userManagement.getPublicProfile(like.liked_user_id)
          .then(user_details => { like.user_details = user_details; });
        promises.push(promiseForUser);
      });
    }
  }

  await Promise.all(promises); // wait for it
  return likes;
}

async function getByApartment(apartmentId) {
  let likes = await likeRepository.findByApartmentId(apartmentId);
  return likes.map(f => f.get({ plain: true }));
}

async function set(apartmentId, listingId, user, tenant, isLiked) {
  // Check if user is resource owner and can remove other user like.
  if (tenant) {
    const listing = await listingRepository.getById(listingId);
    if (userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
      user = tenant;
    } else {
      throw new errors.NotResourceOwnerError();
    }
  }

  try {
    await likeRepository.set(apartmentId, listingId, user.id, isLiked);
  } catch (error) {
    handleSetError(error, apartmentId, listingId, user, isLiked);
  }

  logger.info({
    apartment_id: apartmentId,
    listing_id: listingId,
    user_uuid: user.id,
    is_liked: isLiked
  }, `apartment is ${isLiked ? 'liked' : 'unliked'}`);

  publishLikeEvent(apartmentId, listingId, user.id, isLiked);
}

function publishLikeEvent(apartmentId, listingId, userId, isLiked) {
  const eventType = isLiked ? messageBus.eventType.LISTING_LIKED : messageBus.eventType.LISTING_UNLIKED;
  if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
    messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, eventType, {
      apartment_id: apartmentId,
      listing_id: listingId,
      user_uuid: userId,
      is_liked: isLiked
    });
  }
}

function handleSetError(error, apartmentId, listingId, user, isLiked) {
  if (error.name == 'SequelizeForeignKeyConstraintError') { // hide DB related information in case an error is thrown
    throw new errors.DomainNotFoundError(
      'LikeServiceNonExistingListingError', {
        error,
        user,
        apartment_id: apartmentId,
        listing_id: listingId,
        is_liked: isLiked
      },
      `Could not ${isLiked ? 'like' : 'unlike'} apartment`
    );
  } else {
    throw error;
  }
}

module.exports = {
  getUserLikes,
  getByListing,
  getByApartment,
  set
};
