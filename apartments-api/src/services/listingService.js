'use strict';
const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const geoService = require('./geoService');
const config = shared.config;
const messageBus = shared.utils.messageBus;
const userManagement = shared.utils.userManagement;

// TODO : move this to dorbel-shared
function CustomError(code, message) {
  let error = new Error(message);
  error.status = code;
  return error;
}

function* create(listing) {
  const existingOpenListingForApartment = yield listingRepository.getListingsForApartment(
    listing.apartment,
    { status: { $notIn: ['closed', 'rented'] } }
  );
  if (existingOpenListingForApartment && existingOpenListingForApartment.length) {
    throw new CustomError(409, 'apartment already has an active listing');
  }

  if (listing.lease_start && !listing.lease_end) {
    // Upload form sends only lease_start so we default lease_end to after one year 
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  // In case that roomate is needed, the listing should allow roommates.
  if (listing.roommate_needed) {
    listing.roommates = true;
  }

  let modifiedListing = yield geoService.setGeoLocation(listing);
  let createdListing = yield listingRepository.create(modifiedListing);

  // Update user phone number in auth0.
  let normalizedPhone = normalizePhone(listing.user.phone);
  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(createdListing.publishing_user_id, {
    user_metadata: {
      first_name: listing.user.firstname,
      last_name: listing.user.lastname,
      email: listing.user.email,
      phone: normalizedPhone
    }
  });

  // Publish event trigger message to SNS for notifications dispatching.
  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, {
      user_uuid: createdListing.publishing_user_id,
      user_email: listing.user.email,
      user_phone: normalizedPhone,
      user_first_name: listing.user.firstname,
      user_last_name: listing.user.lastname,
      apartment_id: createdListing.apartment_id
    });
  }

  return createdListing;
}

function* updateStatus(listingId, userId, status) {
  let listing = yield listingRepository.getById(listingId);
  if (listing == undefined) {
    throw new CustomError(400, 'listing "' + listingId + '" does not exist');
  }
  const lastStatus = listing.status;
  const result = yield listingRepository.updateStatus(listing, status);
  const messageBusEvent = messageBus.eventType['APARTMENT_' + status.toUpperCase()];

  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBusEvent, {
      user_uuid: userId,
      listing_id: listingId,
      previous_status: lastStatus
    });
  }

  return result;
}

function normalizePhone(phone) {
  if (phone.startsWith('0')) {
    return '+972' + phone.substring(1).replace(/[-+()]/g, ''); // remove trailing zero, remove special chars.
  } else {
    return phone;
  }
}

function* getById(id) {
  const listing = yield listingRepository.getById(id);
  if (listing) {
    const publishingUser = yield userManagement.getUserDetails(listing.publishing_user_id);
    if (publishingUser) {
      listing.publishing_username = _.get(publishingUser, 'user_metadata.first_name') || publishingUser.given_name;
    }
  }
  return listing;
}

function* getRelated(listingId, numOfItems) {
  let retRelatedListings = [];
  const listing = yield listingRepository.getById(listingId);

  // Verify that the listing exists
  if (listing) {
    let allRelatedListings = yield listingRepository.getRelatedByCity(listingId, listing.apartment.building.city_id);
    retRelatedListings = _.sampleSize(allRelatedListings, numOfItems);
  }

  return retRelatedListings;
}


module.exports = {
  create,
  updateStatus,
  getById,
  getRelated,
  list: listingRepository.list
};
