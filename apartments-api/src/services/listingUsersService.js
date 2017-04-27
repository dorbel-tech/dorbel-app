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

  let existingUser, userToCreate;

  if (payload.email) {
    existingUser = yield userManagement.getUserDetailsByEmail(payload.email);
  }

  if (existingUser) {
    userToCreate = {
      listing_id,
      user_uuid: _.get(existingUser, 'app_metadata.dorbel_user_id'),
      email: _.get(existingUser, 'email'),
      first_name: _.get(existingUser, 'user_metadata.first_name'),
      last_name: _.get(existingUser, 'user_metadata.last_name'),
      phone: _.get(existingUser, 'user_metadata.phone')
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

  return listingUsersRepository.create(userToCreate);
}

function * get(listing_id, requestingUser) {
  yield getAndVerifyListing(listing_id, requestingUser);
  const users = yield listingUsersRepository.getUsersForListing(listing_id);
  return yield users.map(userFromDb => {
    if (userFromDb.user_uuid) {
      return userManagement.getPublicProfile(userFromDb.user_uuid)
        .then(publicProfile => Object.assign(publicProfile, { id: userFromDb.id }));
    } else {
      return _.pick(userFromDb, [ 'email', 'first_name', 'last_name', 'phone', 'id' ]);
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
