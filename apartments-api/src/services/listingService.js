'use strict';
const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const geoService = require('./geoService');
const config = shared.config;
const messageBus = shared.utils.messageBus;
const generic = shared.utils.generic;
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

  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(createdListing.publishing_user_id, {
    user_metadata: {
      first_name: listing.user.firstname,
      last_name: listing.user.lastname,
      email: listing.user.email,
      phone: generic.normalizePhone(listing.user.phone)
    }
  });

  // Publish event trigger message to SNS for notifications dispatching.
  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, {
      user_uuid: createdListing.publishing_user_id,
      user_email: listing.user.email,
      user_phone: generic.normalizePhone(listing.user.phone),
      user_first_name: listing.user.firstname,
      user_last_name: listing.user.lastname,
      listing_id: createdListing.id
    });
  }

  return createdListing;
}

function* updateStatus(listingId, user, status) {
  let listing = yield listingRepository.getById(listingId);

  if (!listing) {
    throw new CustomError(404, 'listing not found');
  } else if (user.role !== 'admin' && listing.publishing_user_id !== user.id) {
    throw new CustomError(403, 'unauthorized to edit this listing');
  } else if (getPossibleStatuses(listing, user).indexOf(status) < 0) {
    throw new CustomError(403, 'unauthorized to change this listing to status ' + status);
  }

  const currentStatus = listing.status;
  const result = yield listing.update({ status });

  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    const messageBusEvent = messageBus.eventType['APARTMENT_' + status.toUpperCase()];
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBusEvent, {
      user_uuid: listing.publishing_user_id,
      listing_id: listingId,
      previous_status: currentStatus
    });
  }

  return result;
}

function* getByFilter(filterJSON) {
  const filter = JSON.parse(filterJSON);

  let listingQuery = {
    status: 'listed'
  };
  if (filter.mrs) {
    _.set(listingQuery, 'monthly_rent.$gte', filter.mrs);
  }
  if (filter.mre) {
    _.set(listingQuery, 'monthly_rent.$lte', filter.mre);
  }

  let options = {};
  if (filter.city) {
    options.buildingQuery = {city_id: filter.city};
  }
  if (filter.minRooms) {
    _.set(options, 'apartmentQuery.rooms.$gte', filter.minRooms);
  }
  if (filter.maxRooms) {
    _.set(options, 'apartmentQuery.rooms.$lte', filter.maxRooms);
  }

  return listingRepository.list(listingQuery, options);
}

function* getById(id, user) {
  let listing = yield listingRepository.getById(id);

  if (listing) {
    listing = listing.toJSON(); // discard SQLize object for adding ad-hoc properties
    const publishingUser = yield userManagement.getUserDetails(listing.publishing_user_id);
    if (publishingUser) {
      listing.publishing_user_first_name = _.get(publishingUser, 'user_metadata.first_name') || publishingUser.given_name;
    }

    listing.meta = {
      possibleStatuses: getPossibleStatuses(listing, user)
    };
  }
  return listing;
}

function getPossibleStatuses(listing, user) {
  let possibleStatuses = [];

  if (user && user.role === 'admin') { // admin can change to all statuses
    possibleStatuses = listingRepository.listingStatuses;
  } else if (listing.status === 'pending' || !user) { // (not admin + pending) or anonymous - can't change at all    
    possibleStatuses = [];
  } else { // not admin + !pending - can change to anything EXCEPT pending
    possibleStatuses = listingRepository.listingStatuses.filter(status => status != 'pending');
  }

  return possibleStatuses.filter(status => status !== listing.status); // exclude current status
}


function* getRelatedListings(listingId, limit) {
  const listing = yield listingRepository.getById(listingId);
  if (listing) { // Verify that the listing exists
    const listingQuery = {
      status: 'listed',
      $not: {
        id: listingId
      }
    };

    const options = {
      buildingQuery: {
        city_id: listing.apartment.building.city_id
      },
      limit: limit,
      order: 'created_at DESC'
    };

    return listingRepository.list(listingQuery, options);
  }
  else {
    throw new CustomError(400, 'listing "' + listingId + '" does not exist');
  }
}

module.exports = {
  create,
  updateStatus,
  getByFilter,
  getById,
  getRelatedListings,
};
