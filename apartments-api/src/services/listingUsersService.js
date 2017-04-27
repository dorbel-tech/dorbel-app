'use strict';
const shared = require('dorbel-shared');
const _ = require('lodash');
const listingUsersRepository = require('../apartmentsDb/repositories/listingUsersRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const permissionsService = require('./permissionsService');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.userManagement;

function * create(listing_id, payload, requestingUser) {
  yield getAndVerifyListing(listing_id, requestingUser);

  if (!payload.email && !payload.first_name) {
    throw new errors.DomainValidationError('missing params', payload, 'must include email or first_name');
  }

  let existingUser;

  if (payload.email) {
    existingUser = yield userManagement.getUserDetailsByEmail(payload.email);
  }

  const userToCreate = existingUser ? {
    listing_id,
    user_uuid: _.get(existingUser, 'app_metadata.dorbel_user_id'),
    email: _.get(existingUser, 'email'),
    first_name: _.get(existingUser, 'user_metadata.first_name'),
    last_name: _.get(existingUser, 'user_metadata.last_name'),
    phone: _.get(existingUser, 'user_metadata.phone')
  } : {
    listing_id,
    email: payload.email,
    first_name: payload.first_name,
    last_name: payload.last_name,
    phone: payload.phone
  };

  return listingUsersRepository.create(userToCreate);
}

function * get(listing_id, requestingUser) {
  yield getAndVerifyListing(listing_id, requestingUser);
  const users = listingUsersRepository.getUsersForListing(listing_id);
  return yield users.map(userFromDb => {
    if (userFromDb.user_uuid) {
      return userManagement.getPublicProfile(userFromDb.user_uuid)
        .then(publicProfile => Object.assign(publicProfile, { id: userFromDb.id }));
    } else {
      return _.pick(userFromDb, [ 'email', 'first_name', 'last_name', 'phone', 'id' ]);
    }
  });
}

// TODO: this is repeating in many places in the API and should be moved to some place generic
function * getAndVerifyListing(listing_id, requestingUser) {
  const listing = yield listingRepository.getById(listing_id);

  if (!listing) {
    throw new errors.DomainNotFoundError('listing not found', { listing_id }, 'listing not found');
  } else if (!permissionsService.isPublishingUserOrAdmin(requestingUser, listing)) {
    throw new errors.NotResourceOwnerError();
  }

  return listing;
}

module.exports = {
  create,
  get: get
};
