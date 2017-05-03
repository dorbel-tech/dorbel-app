'use strict';
const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const likeRepository = require('../apartmentsDb/repositories/likeRepository');
const geoProvider = require('../providers/geoProvider');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const generic = shared.utils.generic;
const userManagement = shared.utils.userManagement;
const permissionsService = require('./permissionsService');

const DEFUALT_LISTING_LIST_LIMIT = 1000;

// TODO : move this to dorbel-shared
function CustomError(code, message) {
  let error = new Error(message);
  error.status = code;
  return error;
}

function* create(listing) {
  const existingOpenListingForApartment = yield listingRepository.getListingsForApartment(
    listing.apartment,
    { status: { $notIn: ['rented', 'unlisted', 'deleted'] } }
  );
  if (existingOpenListingForApartment && existingOpenListingForApartment.length) {
    logger.error(existingOpenListingForApartment, 'Listing already exists');
    throw new CustomError(409, 'הדירה שלך כבר קיימת במערכת');
  }

  // Force 'pending' status for new listings in order to prevent the possibility of setting the status using this API
  listing.status = 'pending';

  let modifiedListing = setListingAutoFields(listing);
  listing.apartment.building.geolocation = yield geoProvider.getGeoLocation(listing.apartment.building);
  let createdListing = yield listingRepository.create(modifiedListing);

  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(createdListing.publishing_user_id, {
    user_metadata: {
      first_name: listing.user.firstname,
      last_name: listing.user.lastname,
      email: listing.user.email,
      phone: generic.normalizePhone(listing.user.phone),
      listing_id: createdListing.id
    }
  });

  // Publish event trigger message to SNS for notifications dispatching.
  if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
    messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageBus.eventType.APARTMENT_CREATED, {
      city_id: listing.apartment.building.city_id,
      listing_id: createdListing.id,
      user_uuid: createdListing.publishing_user_id,
      user_email: listing.user.email,
      user_phone: generic.normalizePhone(listing.user.phone),
      user_first_name: listing.user.firstname,
      user_last_name: listing.user.lastname
    });
  }

  return createdListing;
}

function* update(listingId, user, patch) {
  const listing = yield listingRepository.getById(listingId);
  const oldListing = _.cloneDeep(listing.get({ plain: true }));

  if (!listing) {
    logger.error({ listingId }, 'Listing wasnt found');
    throw new CustomError(404, 'הדירה לא נמצאה');
  }

  const isPublishingUserOrAdmin = listing && permissionsService.isPublishingUserOrAdmin(user, listing);
  const statusChanged = patch.status && patch.status !== listing.status;

  if (!isPublishingUserOrAdmin) {
    logger.error({ listingId }, 'You cant update that listing');
    throw new CustomError(403, 'אין באפשרותך לערוך דירה זו');
  } else if (statusChanged && getPossibleStatuses(listing, user).indexOf(patch.status) < 0) {
    logger.error({ listingId }, 'You cant update this listing status');
    throw new CustomError(403, 'אין באפשרותך לשנות את סטטוס הדירה ל ' + patch.status);
  }

  patch = setListingAutoFields(patch);
  const result = yield listingRepository.update(listing, patch);
  notifyListingChanged(oldListing, patch, statusChanged);

  return yield enrichListingResponse(result, user);
}

// Send notification to updated users of important property fields being changed.
function notifyListingChanged(oldListing, newListing, statusChanged) {
  if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
    if (statusChanged) {
      const messageBusEvent = messageBus.eventType['APARTMENT_' + newListing.status.toUpperCase()];
      messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageBusEvent, {
        city_id: oldListing.apartment.building.city_id,
        listing_id: oldListing.id,
        previous_status: oldListing.status,
        user_uuid: oldListing.publishing_user_id
      });
    } else {
      const isMonthlyRentChanged = (oldListing.monthly_rent !== newListing.monthly_rent) ? true : false;
      const oldLeaseStart = moment(oldListing.lease_start).format('YYYY-MM-DD');
      const newLeaseStart = moment(newListing.lease_start).format('YYYY-MM-DD');
      const isLeaseStartChanged = (oldLeaseStart !== newLeaseStart) ? true : false;
      const isRoomsChanged = oldListing.apartment.rooms !== newListing.apartment.rooms;
      const isStreetNameChanged = oldListing.apartment.building.street_name !== newListing.apartment.building.street_name;
      const isHouseNumberChanged = oldListing.apartment.building.house_number !== newListing.apartment.building.house_number;
      const isFloorChanged = oldListing.apartment.floor !== newListing.apartment.floor;
      const isAptNumberChanged = oldListing.apartment.apt_number !== newListing.apartment.apt_number;
      const isListingEdited = isMonthlyRentChanged || isLeaseStartChanged || isRoomsChanged || isStreetNameChanged ||
        isHouseNumberChanged || isFloorChanged || isAptNumberChanged;

      if (isListingEdited) {
        messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageBus.eventType.LISTING_EDITED, {
          listing_id: oldListing.id,
          user_uuid: oldListing.publishing_user_id,
          prev_monthly_rent: oldListing.monthly_rent,
          prev_lease_start: oldLeaseStart,
          prev_rooms: oldListing.apartment.rooms,
          prev_street_name: oldListing.apartment.building.street_name,
          prev_house_number: oldListing.apartment.building.house_number,
          prev_floor: oldListing.apartment.floor,
          prev_apt_number: oldListing.apartment.apt_number,
          new_monthly_rent: newListing.monthly_rent,
          new_lease_start: newLeaseStart,
          new_rooms: newListing.apartment.rooms,
          new_street_name: newListing.apartment.building.street_name,
          new_house_number: newListing.apartment.building.house_number,
          new_floor: newListing.apartment.floor,
          new_apt_number: newListing.apartment.apt_number,
        });
      }
    }
  }
}

function setListingAutoFields(listing) {
  if (listing.lease_start && !listing.lease_end) {
    // default lease_end to after one year
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  // In case that roomate is needed, the listing should allow roommates.
  if (listing.roommate_needed) {
    listing.roommates = true;
  }

  return listing;
}

function* getByFilter(filterJSON, options = {}) {
  // TODO: Switch to regex test instead of try-catch.
  let filter = {};
  if (filterJSON) {
    try {
      filter = JSON.parse(filterJSON);
    } catch (e) {
      logger.warn(e, 'failed to parse filter JSON');
      filter = {};
    }
  }

  let listingQuery = {
    status: 'listed'
  };

  let queryOptions = {
    order: getSortOption(filter.sort),
    limit: options.limit || DEFUALT_LISTING_LIST_LIMIT,
    offset: options.offset || 0
  };

  if (options.user) {
    if (userManagement.isUserAdmin(options.user)) {
      filter.listed = filter.hasOwnProperty('listed') ? filter.listed : true;

      const filteredStatuses = listingRepository.listingStatuses.filter(
        status => !filter[status]
      );

      // Check if admin filtered statuses manually.
      if (filteredStatuses.length === 0) {
        delete listingQuery.status;
      } else {
        listingQuery.status = { $notIn: filteredStatuses };
      }
    }

    if (filter.liked) {
      queryOptions.likeQuery = {
        is_active: true,
        liked_user_id: options.user.id
      };
    }

    if (filter.myProperties){
      if (!userManagement.isUserAdmin(options.user)) {
        listingQuery.publishing_user_id = options.user.id;
      }

      listingQuery.status = { $notIn: ['deleted'] };
    }
  }

  if (filter.city === '*') {
    _.unset(filter, 'city');
  }

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
    .forEach(key => _.set(filterMapping[key].target || queryOptions,
      filterMapping[key].set,
      filterMapping[key].staticValue || filter[key]));

  return listingRepository.list(listingQuery, queryOptions);
}

function* getById(id, user) {
  let listing = yield listingRepository.getById(id);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by Id. Listing does not exists. litingId: ' + id);
  }

  const isPending = listing.status === 'pending';
  const isDeleted = listing.status === 'deleted';
  const isAdmin = user && permissionsService.isAdmin(user, listing);
  const isPublishingUserOrAdmin = user && permissionsService.isPublishingUserOrAdmin(user, listing);

  // Don't display deleted listings to anyone but admins.
  if (isDeleted && !isAdmin) {
    throw new CustomError(403, 'Cant show deleted listing. User is not a admin. listingId: ' + listing.id);
  }

  // Pending listing will be displayed to user who is listing publisher or admins only.
  if (isPending && !isPublishingUserOrAdmin) {
    throw new CustomError(403, 'Cant show pending listing. User is not a publisher of listingId: ' + listing.id);
  } else {
    return yield enrichListingResponse(listing, user);
  }
}

function* getBySlug(slug, user) {
  let listing = yield listingRepository.getBySlug(slug);
  return yield enrichListingResponse(listing, user);
}

function isNotPendingDeleted(listingStatus) {
  return listingStatus !== 'pending' && listingStatus !== 'deleted';
}

function getPossibleStatuses(listing, user) {
  let possibleStatuses = [];

  if (user) {
    if (userManagement.isUserAdmin(user)) {
      // admin can change to all statuses
      possibleStatuses = listingRepository.listingStatuses;
    }
    else if (permissionsService.isPublishingUser(user, listing) && isNotPendingDeleted(listing.status)) {
      // listing owner can change to anything but pending or deleted, unless the listing is pending
      possibleStatuses = listingRepository.listingStatuses.filter(status => isNotPendingDeleted(status));
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

    if (user && (permissionsService.isPublishingUserOrAdmin(user, listing))) {
      enrichedListing.totalLikes = yield likeRepository.getListingTotalLikes(listing.id);
    }

    return enrichedListing;
  }

  return listing;
}

function* getRelatedListings(listingId, limit) {
  const listing = yield listingRepository.getById(listingId);

  if (!listing) { // Verify that the listing exists
    throw new CustomError(404, 'Failed to get related listings. Listing does not exists. litingId: ' + listingId);
  }

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

function getSortOption(sortStr) {
  switch (sortStr) {
    case 'lease_start':
      return 'lease_start ASC';
    case 'publish_date':
      return 'created_at DESC';

    default:
      return 'created_at DESC';
  }
}

module.exports = {
  create,
  update,
  getByFilter,
  getById,
  getBySlug,
  getRelatedListings,
};
