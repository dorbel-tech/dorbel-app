'use strict';
const shared = require('dorbel-shared');
const _ = require('lodash');
const listingUsersRepository = require('../apartmentsDb/repositories/listingUsersRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const permissionsService = require('./permissionsService');
const errors = shared.utils.domainErrors;
const logger = shared.logger.getLogger(module);
const userManagement = shared.utils.userManagement;

function * create(listing_id, payload, requestingUser) {
  yield getAndVerifyListing(listing_id, requestingUser);

  // TODO : check for duplicate users on same listing

  let publicUserProfile, listingUserToCreate;

  if (payload.email) {
    publicUserProfile = yield userManagement.getPublicProfileByEmail(payload.email);
  }

  if (publicUserProfile) {
    // only saving these as the rest of the details should kept in Auth0
    listingUserToCreate = {
      listing_id,
      dorbel_user_id: publicUserProfile.dorbel_user_id,
    };
  } else if (!payload.first_name) {
    throw new errors.DomainValidationError('missing params', payload, 'must include first_name for non-registered user');
  } else {
    listingUserToCreate = {
      listing_id,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone: payload.phone
    };
  }

  return listingUsersRepository.create(listingUserToCreate)
    .then(listingUserFromDb => mapToListingUserResponse(listingUserFromDb, publicUserProfile));
}

function * get(listing_id, requestingUser) {
  yield getAndVerifyListing(listing_id, requestingUser);
  const users = yield listingUsersRepository.getUsersForListing(listing_id);
  return yield users.map(listingUserFromDb => {
    if (listingUserFromDb.dorbel_user_id) {
      return userManagement.getPublicProfile(listingUserFromDb.dorbel_user_id)
        .then(publicUserProfile => mapToListingUserResponse(listingUserFromDb, publicUserProfile));
    } else {
      return mapToListingUserResponse(listingUserFromDb);
    }
  });
}

function * remove(listing_user_id, requestingUser) {
  const listingUser = yield listingUsersRepository.getUserById(listing_user_id);

  if (!listingUser) {
    throw new errors.DomainNotFoundError('listing user not found', { listing_user_id }, 'listing user not found');
  }

  yield getAndVerifyListing(listingUser.listing_id, requestingUser);

  return listingUsersRepository.remove(listing_user_id);
}

function mapToListingUserResponse(listingUserFromDb, publicProfile) {
  const listingUserResponse = _.pick(listingUserFromDb, [ 'email', 'first_name', 'last_name', 'phone', 'id', 'listing_id' ]);

  if (listingUserFromDb.dorbel_user_id && !publicProfile) {
    throw new errors.DomainNotFoundError('missing public profile', listingUserFromDb, 'known user must have public profile');
  } if (listingUserFromDb.dorbel_user_id) {
    Object.assign(listingUserResponse, publicProfile);
  }

  return listingUserResponse;
}

// TODO: this is repeating in many places in the API and should be moved to some place generic
function * getAndVerifyListing(listing_id, requestingUser) {
  const listing = yield listingRepository.getById(listing_id);

  if (!listing) {
    throw new errors.DomainNotFoundError('listing not found', { listing_id }, 'listing not found');
  } else if (!permissionsService.isPublishingUserOrAdmin(requestingUser, listing)) {
    logger.error({ resource_owner_id: listing.publishing_user_id, user_id: requestingUser.id }, 'Requesting user is not the resource owner!');
    throw new errors.NotResourceOwnerError();
  }

  return listing;
}

module.exports = {
  create,
  get: get,
  remove
};
