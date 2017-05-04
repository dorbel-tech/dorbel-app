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

  let publicProfile, userToCreate;

  if (payload.email) {
    publicProfile = yield userManagement.getPublicProfileByEmail(payload.email);
  }

  if (publicProfile) {
    // only saving these as the rest of the details should kept in Auth0
    userToCreate = {
      listing_id,
      user_uuid: publicProfile.id,
    };
  } else if (!payload.first_name) {
    throw new errors.DomainValidationError('missing params', payload, 'must include first_name for non-registered user');
  } else {
    userToCreate = {
      listing_id,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone: payload.phone
    };
  }

  return listingUsersRepository.create(userToCreate)
    .then(userFromDb => mapToListingUserResponse(userFromDb, publicProfile));
}

function * get(listing_id, requestingUser) {
  yield getAndVerifyListing(listing_id, requestingUser);
  const users = yield listingUsersRepository.getUsersForListing(listing_id);
  return yield users.map(userFromDb => {
    if (userFromDb.user_uuid) {
      return userManagement.getPublicProfile(userFromDb.user_uuid)
        .then(publicProfile => mapToListingUserResponse(userFromDb, publicProfile));
    } else {
      return mapToListingUserResponse(userFromDb);
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

function mapToListingUserResponse(userFromDb, publicProfile) {
  const listingUser = _.pick(userFromDb, [ 'email', 'first_name', 'last_name', 'phone', 'id', 'listing_id' ]);

  if (userFromDb.user_uuid && !publicProfile) {
    throw new errors.DomainNotFoundError('missing public profile', userFromDb, 'known user must have public profile');
  } else if (userFromDb.user_uuid) {
    return Object.assign({}, listingUser, _.omit(publicProfile, ['id']));
  } else {
    return listingUser;
  }
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
