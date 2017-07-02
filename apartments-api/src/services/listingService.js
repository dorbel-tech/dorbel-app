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
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;
const ValidationError = shared.utils.domainErrors.DomainValidationError;

const DEFUALT_LISTING_LIST_LIMIT = 15;
const MAX_LISTING_LIST_LIMIT = 30;

const possibleStatusesByCurrentStatus = {
  pending: ['unlisted', 'deleted'],
  rented: ['unlisted', 'deleted'],
  unlisted: ['rented', 'deleted'],
  listed: ['rented', 'unlisted', 'deleted']
};

const createdEventsByListingStatus = {
  pending: messageBus.eventType.APARTMENT_CREATED,
  rented: messageBus.eventType.APARTMENT_CREATED_FOR_MANAGEMENT
};

// TODO : move this to dorbel-shared
function CustomError(code, message) {
  let error = new Error(message);
  error.status = code;
  return error;
}

function* create(listing, user) {
  listing.publishing_user_id = user.id;
  yield validateNewListing(listing, user);

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
      apartment_id: createdListing.apartment_id
    }
  });

  // Publish event trigger message to SNS for notifications dispatching.
  const messageType = createdEventsByListingStatus[listing.status];

  if (messageType) {
    if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
      messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageType, {
        city_id: listing.apartment.building.city_id,
        apartment_id: createdListing.apartment_id,
        listing_id: createdListing.id,
        user_uuid: createdListing.publishing_user_id,
        user_email: listing.user.email,
        user_phone: generic.normalizePhone(listing.user.phone),
        user_first_name: listing.user.firstname,
        user_last_name: listing.user.lastname
      });
    }
  }
  else { logger.error({ listing }, 'Could not find notification type for created listing'); }

  return createdListing;
}

function* validateNewListing(listing, user) {
  if (['pending', 'rented'].indexOf(listing.status) < 0) {
    throw new CustomError(400, `לא ניתן להעלות דירה ב status ${listing.status}`);
  }

  const validationData = yield getValidationData(listing.apartment, user);
  if (validationData.listing_id) {
    const loggerObj = {
      requestingUser: user,
      listing,
      validationData
    };

    switch (validationData.status) {
      case 'belongsToOtherUser':
        logger.error(loggerObj, 'Apartment belongs to another user');
        throw new CustomError(409, 'דירה זו משוייכת למשתשמש אחר. אנא וודאו את הפרטים/צרו קשר עימנו לתמיכה.');
      case 'alreadyListed':
        logger.error(loggerObj, 'Aparment already listed');
        throw new CustomError(409, 'דירה זו כבר מפורסמת במערכת. לא ניתן להעלות אותה שוב.');
      default:
        break;
    }
  }

  // Disable uploading apartment for listing without images
  if (listing.status == 'pending' && (!listing.images || !listing.images.length)) {
    throw new CustomError(400, 'לא ניתן להעלות מודעה להשכרה ללא תמונות');
  }
}

function* update(listingId, user, patch) {
  const listing = yield listingRepository.getById(listingId);

  if (!listing) {
    logger.error({ listingId }, 'Listing wasnt found');
    throw new CustomError(404, 'הדירה לא נמצאה');
  }

  const oldListing = _.cloneDeep(listing.get({ plain: true }));
  const isPublishingUserOrAdmin = listing && userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id);

  if (!isPublishingUserOrAdmin) {
    logger.error({ listingId }, 'You cant update that listing');
    throw new CustomError(403, 'אין באפשרותך לערוך דירה זו');
  } else if (isStatusChanged(listing, patch) && getPossibleStatuses(listing, user).indexOf(patch.status) < 0) {
    logger.error({ listingId }, 'You cant update this listing status');
    throw new CustomError(403, 'אין באפשרותך לשנות את סטטוס הדירה ל ' + patch.status);
  }

  patch = setListingAutoFields(patch);
  const result = yield listingRepository.update(listing, patch);
  notifyListingChanged(oldListing, patch);

  return yield enrichListingResponse(result, user);
}

function isStatusChanged(oldListing, newListing) {
  return newListing.status && newListing.status !== oldListing.status;
}

// Send notifications to users on changes in listing
function notifyListingChanged(oldListing, newListing) {
  if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
    const isMonthlyRentSent = newListing.monthly_rent;

    // Notify in case of listing status change.
    if (isStatusChanged(oldListing, newListing)) {
      const messageBusEvent = messageBus.eventType['APARTMENT_' + newListing.status.toUpperCase()];
      messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageBusEvent, {
        apartment_id: oldListing.apartment_id,
        listing_id: oldListing.id,
        city_id: oldListing.apartment.building.city_id,
        previous_status: oldListing.status,
        user_uuid: oldListing.publishing_user_id
      });
    }
    // Send notification to updated users of important property fields being changed.
    else if (isMonthlyRentSent) {
      const isMonthlyRentChanged = oldListing.monthly_rent !== newListing.monthly_rent;
      const oldLeaseStart = moment(oldListing.lease_start).format('YYYY-MM-DD');
      const newLeaseStart = moment(newListing.lease_start).format('YYYY-MM-DD');
      const isLeaseStartChanged = oldLeaseStart !== newLeaseStart;
      const isRoomsChanged = oldListing.apartment.rooms !== newListing.apartment.rooms;
      const isStreetNameChanged = oldListing.apartment.building.street_name !== newListing.apartment.building.street_name;
      const isHouseNumberChanged = oldListing.apartment.building.house_number !== newListing.apartment.building.house_number;
      const isFloorChanged = oldListing.apartment.floor !== newListing.apartment.floor;
      const isAptNumberChanged = oldListing.apartment.apt_number !== newListing.apartment.apt_number;
      const isListingEdited = isMonthlyRentChanged || isLeaseStartChanged || isRoomsChanged || isStreetNameChanged ||
        isHouseNumberChanged || isFloorChanged || isAptNumberChanged;

      if (isListingEdited) {
        messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageBus.eventType.LISTING_EDITED, {
          apartment_id: oldListing.apartment_id,
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
  // default lease_end to after one year
  if (listing.lease_start && (!listing.lease_end || listing.status == 'pending')) {
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  // In case that roomate is needed, the listing should allow roommates.
  if (listing.roommate_needed) {
    listing.roommates = true;
  }

  // In case that listing was approved (listed) or submitted for manage and have images,
  // we can safely show_for_future_booking enabled by default, because we validated all apartment details.
  if ((listing.status === 'listed') ||
    (listing.status === 'rented' && listing.images && listing.images.length > 0)) {
    listing.show_for_future_booking = true;
  }

  return listing;
}

function* getByFilter(filterJSON, options = {}) {
  // TODO: Switch to regex test instead of try-catch.
  // TODO: filter string-to-json belongs in the controller layer - it's an interface detail and not a business concern
  let filter = {};
  if (filterJSON) {
    try {
      filter = JSON.parse(filterJSON);
    } catch (e) {
      throw new ValidationError('Failed to parse filter JSON!');
    }
  }

  // Validate that the limit sent is reasonable.
  if (options.limit && options.limit > MAX_LISTING_LIST_LIMIT) {
    throw new ValidationError('Unable to return so many lising results in one query! Limit asked: ' + options.limit);
  }

  const listingQuery = {};

  if (filter.futureBooking === false) {
    listingQuery.$or = [ { status: 'listed' } ];
  } else {
    // TODO : what if there are other things that require $or ?
    listingQuery.$or = [
      { status: 'listed' },
      {
        status: 'rented',
        lease_end: { $gte: moment().add(1, 'month').toDate() }, // lease ends at least a month from now
        show_for_future_booking: true
      }
    ];
  }

  let queryOptions = {
    order: getSortOption(filter.sort),
    limit: options.limit || DEFUALT_LISTING_LIST_LIMIT,
    offset: options.offset || 0,
    oldListings: filter.oldListings
  };

  if (options.user) {
    if (userPermissions.isUserAdmin(options.user)) {
      filter.listed = filter.hasOwnProperty('listed') ? filter.listed : true;

      const filteredStatuses = listingRepository.listingStatuses.filter(
        status => !filter[status]
      );

      // Check if admin filtered statuses manually.
      if (filteredStatuses.length === 0) {
        listingQuery.$or.forEach(function(condition) {
          delete condition.status;
        });
      } else {
        listingQuery.$or = [ { status: { $notIn: filteredStatuses }} ];
      }
    }

    // Get user liked apartments only.
    if (filter.liked) {
      listingQuery.$or = [ { status: { $notIn: ['deleted'] }} ];
      queryOptions.limit = undefined; // Since no pagination in liked apartments, removing limit.

      queryOptions.likeQuery = {
        is_active: true,
        liked_user_id: options.user.id
      };
    }

    // Get user properties only.
    if (filter.myProperties) {
      if (!userPermissions.isUserAdmin(options.user)) {
        listingQuery.publishing_user_id = options.user.id;
      }

      listingQuery.$or = [ { status: { $notIn: ['deleted'] }} ];
    }
  } else if (!options.user && (filter.myProperties || filter.liked)) {
    throw CustomError(403, 'unauthorized for this view');
  }

  if (filter.city === '*') {
    _.unset(filter, 'city');
  }
  if (filter.neighborhood === '*') {
    _.unset(filter, 'neighborhood');
  }

  var filterMapping = {
    // Listing monthly rent start (minimum)
    mrs: { set: 'monthly_rent.$gte', target: listingQuery },
    // Listing monthly rent end (maximum)
    mre: { set: 'monthly_rent.$lte', target: listingQuery },
    // Listing with a roomate (a roomate looking for roomate/s).
    room: { set: 'roommate_needed', target: listingQuery },
    city: { set: 'buildingQuery.city_id' },
    neighborhood: { set: 'neighborhoodQuery.id' },
    ele: { set: 'buildingQuery.elevator', staticValue: true },
    minRooms: { set: 'apartmentQuery.rooms.$gte' },
    maxRooms: { set: 'apartmentQuery.rooms.$lte' },
    park: { set: 'apartmentQuery.parking', staticValue: true },
    balc: { set: 'apartmentQuery.balcony', staticValue: true },
    ac: { set: 'apartmentQuery.air_conditioning', staticValue: true },
    pet: { set: 'apartmentQuery.pets', staticValue: true },
    sb: { set: 'apartmentQuery.security_bars', staticValue: true },
    apartment_id: { set: 'apartment_id', target: listingQuery }
  };

  Object.keys(filterMapping)
    .filter(key => filter.hasOwnProperty(key))
    .forEach(key => _.set(filterMapping[key].target || queryOptions,
      filterMapping[key].set,
      filterMapping[key].staticValue || filter[key]));

  return listingRepository.list(listingQuery, queryOptions);
}

function* getByApartmentId(id, user) {
  let listing = yield listingRepository.getByApartmentId(id);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by apartmentId. Listing does not exists. apartmentId: ' + id);
  }

  validateListing(listing, user);
  return yield enrichListingResponse(listing, user);
}

function* getById(id, user) {
  let listing = yield listingRepository.getById(id);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by Id. Listing does not exists. listingId: ' + id);
  }

  validateListing(listing, user);
  return yield enrichListingResponse(listing, user);
}

function validateListing(listing, user) {
  const isPending = listing.status === 'pending';
  const isDeleted = listing.status === 'deleted';
  const isAdmin = userPermissions.isUserAdmin(user);
  const isPublishingUserOrAdmin = userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id);

  // Don't display deleted listings to anyone but admins.
  if (isDeleted && !isAdmin) {
    throw new CustomError(403, 'Cant show deleted listing. User is not a admin. listingId: ' + listing.id);
  }

  // Pending listing will be displayed to user who is listing publisher or admins only.
  if (isPending && !isPublishingUserOrAdmin) {
    throw new CustomError(403, 'Cant show pending listing. User is not a publisher of listingId: ' + listing.id);
  }
}

function* getBySlug(slug, user) {
  // TODO: Remove once all legacy listing urls with slug are outdated.
  logger.warn('You are using deprecated function, please use getByApartmentId instead!');
  let listing = yield listingRepository.getBySlug(slug);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by slug. Listing does not exists. slug: ' + slug);
  }

  return yield enrichListingResponse(listing, user);
}

function getPossibleStatuses(listing, user) {
  let possibleStatuses = [];
  if (user) {
    if (userPermissions.isUserAdmin(user)) {
      // admin can change to all statuses
      possibleStatuses = listingRepository.listingStatuses;
    } else if (userPermissions.isResourceOwner(user, listing.publishing_user_id)) {
      possibleStatuses = possibleStatusesByCurrentStatus[listing.status] || [];
    }
  }
  return possibleStatuses;
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

    if (listing.images && listing.images.length) {
      enrichedListing.images = _.orderBy(listing.images, ['display_order']);
    } else {
      enrichedListing.images = [{ url: 'https://static.dorbel.com/images/meta/no-image-placeholder.svg' }];
    }

    if (user) {
      if (userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
        enrichedListing.totalLikes = yield likeRepository.getApartmentTotalLikes(listing.apartment_id);
      }
      else {
        delete enrichedListing.property_value;
      }
      // TODO: Implemented this way as discussed - should be different api call when possible
      if (listing.show_phone) {
        enrichedListing.publishing_user_phone = _.get(publishingUser, 'user_metadata.phone' || 'phone') || '';
      }
    }
    else {
      delete enrichedListing.property_value;
    }

    return enrichedListing;
  }

  return listing;
}

function* getRelatedListings(apartmentId, limit) {
  const listing = yield listingRepository.getByApartmentId(apartmentId);

  if (!listing) { // Verify that the listing exists
    throw new CustomError(404, 'Failed to get related listings. Listing does not exists. apartmentId: ' + apartmentId);
  }

  const listingQuery = {
    status: 'listed',
    $not: {
      apartment_id: apartmentId
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

function* getValidationData(apartment, user) {
  let result = {
    status: 'OK',
    listing_id: 0
  };

  const queryOptions = {
    listingAttributes: ['id', 'status', 'publishing_user_id'],

    // Add entrance to query if defined
    buildingQuery: Object.assign({
      city_id: apartment.building.city.id,
      street_name: apartment.building.street_name,
      house_number: apartment.building.house_number,
    }, apartment.building.entrance ? { entrance: apartment.building.entrance } : {}),

    apartmentQuery: {
      apt_number: apartment.apt_number
    }
  };

  const validationData = yield listingRepository.list(undefined, queryOptions);
  if (validationData && validationData.length) {
    result.listing_id = validationData[0].id;
    result.status = 'alreadyExists';

    if (user.id != validationData[0].publishing_user_id && !userPermissions.isUserAdmin(user)) {
      result.status = 'belongsToOtherUser';
    }
    else if (['listed', 'pending'].indexOf(validationData[0].status) > -1) {
      result.status = 'alreadyListed';
    }
  }
  return result;
}

function* getMonthlyReportData(leaseStartDay, leaseStartMonth, user) {
  if (userPermissions.isUserAdmin(user)) {
    return yield listingRepository.getMonthlyReportData(leaseStartDay, leaseStartMonth);
  }
  else {
    throw new CustomError(403, 'This endpoint is for admins only');
  }
}

module.exports = {
  create,
  update,
  getByFilter,
  getById,
  getBySlug,
  getByApartmentId,
  getRelatedListings,
  getValidationData,
  getMonthlyReportData
};
