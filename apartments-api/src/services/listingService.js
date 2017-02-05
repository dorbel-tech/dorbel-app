'use strict';
const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const geoService = require('./geoService');
const config = shared.config;
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const generic = shared.utils.generic;
const userManagement = shared.utils.userManagement;
const permissionsService = require('./permissionsService');

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
    logger.error(existingOpenListingForApartment, 'Listing already exists');
    throw new CustomError(409, 'הדירה שלך כבר קיימת במערכת');
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
  const isPublishingUserOrAdmin = permissionsService.isPublishingUserOrAdmin(user, listing);

  if (!listing) {
    logger.error({ listingId }, 'Listing wasnt found');
    throw new CustomError(404, 'הדירה לא נמצאה');
  } else if (!isPublishingUserOrAdmin) {
    logger.error({ listingId }, 'You cant update that listing');
    throw new CustomError(403, 'אין באפשרותך לערוך דירה זו');
  } else if (getPossibleStatuses(listing, user).indexOf(status) < 0) {
    logger.error({ listingId }, 'You cant update this listing status');
    throw new CustomError(403, 'אין באפשרותך לשנות את סטטוס הדירה ל ' + status);
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

  return yield enrichListingResponse(result, user);
}

function* getByFilter(filterJSON, user) {
  // TODO: Switch to regex test instead of try-catch.
  let filter = {};
  if (filterJSON) {
    try {
      filter = JSON.parse(filterJSON);
    } catch (e) {
      filter = {};
    }
  }

  let listingQuery = {
    status: 'listed'
  };

  if (user && userManagement.isUserAdmin(user)) {
    delete listingQuery.status; // admin can see all the statuses
  }

  let options = {
    order: [['created_at', 'DESC']]
  };

  var filterMapping = {
    // Listing monthly rent start.
    mrs: { set: 'monthly_rent.$gte', target: listingQuery },
    // Listing monthly rent end.
    mre: { set: 'monthly_rent.$lte', target: listingQuery },
    // Listing with a roomate (a roomate looking for roomate/s).
    room: { set: 'roommate_needed', target: listingQuery },
    // Building city ID.
    city: { set: 'buildingQuery.city_id' },
    // Building has elevator.
    ele: { set: 'buildingQuery.elevator', staticValue: true },
    // Apartment minimum number of rooms.
    minRooms: { set: 'apartmentQuery.rooms.$gte' },
    // Apartment maximum number of rooms.
    maxRooms: { set: 'apartmentQuery.rooms.$lte' },
    // Apartment minimum size.
    minSize: { set: 'apartmentQuery.size.$gte' },
    // Apartment maximum size.
    maxSize: { set: 'apartmentQuery.size.$lte' },
    // Apartment has parking.
    park: { set: 'apartmentQuery.parking', staticValue: true },
    // Apartment has balcony.
    balc: { set: 'apartmentQuery.balcony', staticValue: true },
    // Apartment has air conditioning.
    ac: { set: 'apartmentQuery.air_conditioning', staticValue: true },
    // Apartment allows pets.
    pet: { set: 'apartmentQuery.pets', staticValue: true },
    // Apartment has security bars.
    sb: { set: 'apartmentQuery.security_bars', staticValue: true }
  };

  Object.keys(filterMapping)
    .filter(key => filter.hasOwnProperty(key))
    .forEach(key => _.set(filterMapping[key].target || options,
      filterMapping[key].set,
      filterMapping[key].staticValue || filter[key]));

  return listingRepository.list(listingQuery, options);
}

function* getById(id, user) {
  let listing = yield listingRepository.getById(id);
  const isPending = listing.status === 'pending';

  // TODO: Fix the server rendering error with user object not existing there. The only solution to SSR with auth is cookies. 
  //  We could save the user's token to a cookie and try to parse it on the server as a fallback from the authentication header or something like that.
  const isPublishingUserOrAdmin = user && permissionsService.isPublishingUserOrAdmin(user, listing);

  // Pending listing will be displayed to user who is listing publisher or admins only.
  if (isPending && !isPublishingUserOrAdmin) {
    throw new CustomError(404, 'Cant show pending listing. User is not admin or publisher of listingId ' + listing.id);
  } else {
    return yield enrichListingResponse(listing, user);
  }
}

function* getBySlug(slug, user) {
  let listing = yield listingRepository.getBySlug(slug);
  return yield enrichListingResponse(listing, user);
}

function getPossibleStatuses(listing, user) {
  let possibleStatuses = [];

  if (user) {
    if (userManagement.isUserAdmin(user)) {
      // admin can change to all statuses
      possibleStatuses = listingRepository.listingStatuses;
    }
    else if (permissionsService.isPublishingUser(user, listing) && listing.status !== 'pending') {
      // listing owner can change to anything but pending, unless tho listing is pending
      possibleStatuses = listingRepository.listingStatuses.filter(status => status != 'pending');
    }
  }

  return possibleStatuses.filter(status => status !== listing.status); // exclude current status
}

function* enrichListingResponse(listing, user) {
  if (listing) {
    const enrichedListing = listing.toJSON ? listing.toJSON() : _.cloneDeep(listing); // discard SQLize object for adding ad-hoc properties

    const publishingUser = yield userManagement.getUserDetails(listing.publishing_user_id);
    if (publishingUser) {
      enrichedListing.publishing_user_first_name = _.get(publishingUser, 'user_metadata.first_name') || publishingUser.given_name;
    }

    enrichedListing.meta = {
      possibleStatuses: getPossibleStatuses(listing, user)
    };

    return enrichedListing;
  }

  return listing;
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
    logger.error({ listingId }, 'Cant get related listings for not existing listing');
    throw new CustomError(400, 'listing does not exist');
  }
}

module.exports = {
  create,
  updateStatus,
  getByFilter,
  getById,
  getBySlug,
  getRelatedListings,
};
