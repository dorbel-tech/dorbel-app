'use strict';
const shared = require('dorbel-shared');
const _ = require('lodash');
const listingUsersRepository = require('../apartmentsDb/repositories/listingUsersRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;

const PICTURE_PLACEHOLDER = 'https://static.dorbel.com/images/icons/user-picture-placeholder.png';

async function create(listing_id, payload, requestingUser) {
  await getAndVerifyListing(listing_id, requestingUser);

  // TODO : check for duplicate users on same listing

  let publicUserProfile, listingUserToCreate;

  if (payload.email) {
    publicUserProfile = await userManagement.getPublicProfileByEmail(payload.email);
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
      last_name: payload.last_name
    };
  }

  return listingUsersRepository.create(listingUserToCreate)
    .then(listingUserFromDb => mapToListingUserResponse(listingUserFromDb, publicUserProfile));
}

async function get(listing_id, requestingUser) {
  await getAndVerifyListing(listing_id, requestingUser);
  const users = await listingUsersRepository.getUsersForListing(listing_id);
  return await Promise.all(users.map(listingUserFromDb => {
    if (listingUserFromDb.dorbel_user_id) {
      return userManagement.getPublicProfile(listingUserFromDb.dorbel_user_id)
        .then(publicUserProfile => mapToListingUserResponse(listingUserFromDb, publicUserProfile));
    } else {
      return mapToListingUserResponse(listingUserFromDb);
    }
  }));
}

async function remove(listing_user_id, requestingUser) {
  const listingUser = await listingUsersRepository.getUserById(listing_user_id);

  if (!listingUser) {
    throw new errors.DomainNotFoundError('listing user not found', { listing_user_id }, 'listing user not found');
  }

  await getAndVerifyListing(listingUser.listing_id, requestingUser);

  return listingUsersRepository.remove(listing_user_id);
}

function mapToListingUserResponse(listingUserFromDb, publicProfile) {
  const listingUserResponse = _.pick(listingUserFromDb, [ 'email', 'first_name', 'last_name', 'id', 'listing_id' ]);

  if (listingUserFromDb.dorbel_user_id && !publicProfile) {
    throw new errors.DomainNotFoundError('missing public profile', listingUserFromDb, 'known user must have public profile');
  } if (listingUserFromDb.dorbel_user_id) {
    Object.assign(listingUserResponse, publicProfile);
  }

  listingUserResponse.tenant_profile = listingUserResponse.tenant_profile || {};
  listingUserResponse.picture = listingUserResponse.picture || PICTURE_PLACEHOLDER;

  return listingUserResponse;
}

// TODO: this is repeating in many places in the API and should be moved to some place generic
async function getAndVerifyListing(listing_id, requestingUser) {
  const listing = await listingRepository.getById(listing_id);

  if (!listing) {
    throw new errors.DomainNotFoundError('listing not found', { listing_id }, 'listing not found');
  }

  userPermissions.validateResourceOwnership(requestingUser, listing.publishing_user_id);
  return listing;
}

module.exports = {
  create,
  get: get,
  remove
};
