'use strict';
const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const likeRepository = require('../apartmentsDb/repositories/likeRepository');
const listingSearchQuery = require('./listingService.searchQuery');
const addressStringToBuildingObject = require('./utils/addressUtils').parseBuildingObject;
const logger = shared.logger.getLogger(module);
const { messageBus, generic, analytics } = shared.utils;
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;

const APARTMENTS_UINQUE_CONSTRAINT_INDEX_NAME = 'apartments_index';

const possibleStatusesByCurrentStatus = {
  unlisted: ['listed', 'rented'],
  listed: ['unlisted', 'rented']
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

async function create(listing, user) {
  const publishingUserId = user.id;
  listing.publishing_user_id = publishingUserId;
  await validateNewListing(listing, user);

  let modifiedListing = setListingAutoFields(listing);
  Object.assign(listing.apartment.building, await addressStringToBuildingObject(listing.apartment.building));
  
  let createdListing = await listingRepository.create(modifiedListing);

  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(publishingUserId, {
    user_metadata: {
      first_name: listing.user.firstname,
      last_name: listing.user.lastname,
      email: listing.user.email,
      phone: generic.normalizePhone(listing.user.phone),
      listing_id: createdListing.id,
      apartment_id: createdListing.apartment_id
    }
  });

  // Publish event trigger message to SNS for notifications dispatching.
  const messageType = createdEventsByListingStatus[listing.status];
  const publishingUserType = createdListing.publishing_user_type;

  if (messageType) {
    if (process.env.NOTIFICATIONS_SNS_TOPIC_ARN) {
      messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageType, {
        apartment_id: createdListing.apartment_id,
        listing_id: createdListing.id,
        city_id: createdListing.apartment.building.city_id,
        city_name: createdListing.apartment.building.city.city_name,
        publishing_user_type: publishingUserType,
        user_uuid: publishingUserId,
        user_email: listing.user.email,
        user_phone: generic.normalizePhone(listing.user.phone),
        user_first_name: listing.user.firstname,
        user_last_name: listing.user.lastname,
      });
    }
  }
  else { logger.error({ listing }, 'Could not find notification type for created listing'); }

  // For Intercom user segmentation.
  let intercomEventName = (publishingUserType == 'landlord') ? 'apartment_created_by_real_landlord' : 'apartment_created_by_outgoing_tenant';
  analytics.track(publishingUserId, intercomEventName, { listing_id: createdListing.id });

  return createdListing;
}

async function validateNewListing(listing, user) {
  if (['pending', 'rented'].indexOf(listing.status) < 0) {
    throw new CustomError(400, `לא ניתן להעלות דירה ב status ${listing.status}`);
  }

  const validationData = await getValidationData(listing.apartment, user);
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

async function update(listingId, user, patch) {
  const listing = await listingRepository.getById(listingId);

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

  try {
    const result = await listingRepository.update(listing, patch);
    notifyListingChanged(oldListing, patch);
    return await enrichListingResponse(result, user);
  }
  catch (ex) {
    // Handle a case where the requested changes conflict with a different apartment's details
    if (ex.name == 'SequelizeUniqueConstraintError' && ex.fields && ex.fields[APARTMENTS_UINQUE_CONSTRAINT_INDEX_NAME]) {
      throw new CustomError(409, 'דירה עם פרטים זהים כבר קיימת במערכת');
    }
    else{
      throw ex;
    }
  }
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
        city_name: oldListing.apartment.building.city.city_name,
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
  if (listing.images && listing.images.length > 0 && listing.publishing_user_type == 'landlord') {
    listing.show_for_future_booking = true;
  }

  return listing;
}

async function getByFilter(filter = {}, options = {}) {
  const { listingQuery, queryOptions } = listingSearchQuery.getListingQuery(filter, options);
  const listings = await listingRepository.list(listingQuery, queryOptions);

  if (!filter.myProperties) {
    listings.forEach(listing => {
      listing.apartment.apt_number = undefined;
      listing.apartment.building.house_number = undefined;
    });
  }

  return listings;
}

async function getByApartmentId(id, user) {
  let listing = await listingRepository.getByApartmentId(id);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by apartmentId. Listing does not exists. apartmentId: ' + id);
  }

  validateListing(listing, user);
  return await enrichListingResponse(listing, user);
}

async function getById(id, user) {
  let listing = await listingRepository.getById(id);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by Id. Listing does not exists. listingId: ' + id);
  }

  validateListing(listing, user);
  return await enrichListingResponse(listing, user);
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

async function getBySlug(slug, user) {
  // TODO: Remove once all legacy listing urls with slug are outdated.
  logger.warn('You are using deprecated function, please use getByApartmentId instead!');
  let listing = await listingRepository.getBySlug(slug);

  if (!listing) {
    throw new CustomError(404, 'Cant get listing by slug. Listing does not exists. slug: ' + slug);
  }

  return await enrichListingResponse(listing, user);
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

async function enrichListingResponse(listing, user) {
  if (listing) {
    const enrichedListing = listing.toJSON ? listing.toJSON() : _.cloneDeep(listing); // discard SQLize object for adding ad-hoc properties

    const publishingUserProfile = await userManagement.getPublicProfile(listing.publishing_user_id);
    if (publishingUserProfile) {
      enrichedListing.publishing_user_first_name = publishingUserProfile.first_name;
      enrichedListing.allow_publisher_messages = publishingUserProfile.allow_publisher_messages;
    }

    enrichedListing.meta = {
      possibleStatuses: getPossibleStatuses(listing, user)
    };

    enrichedListing.images = _.orderBy(listing.images, ['display_order']);

    if (user) {
      if (userPermissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
        enrichedListing.totalLikes = await likeRepository.getApartmentTotalLikes(listing.apartment_id);
      }
      else {
        throwIfNotAllowed(listing);
        delete enrichedListing.property_value;
      }
      if (publishingUserProfile) {
        enrichedListing.publishing_user_email = publishingUserProfile.email;
      }
      // TODO: Implemented this way as discussed - should be different api call when possible
      if (listing.show_phone) {
        enrichedListing.publishing_user_phone = publishingUserProfile.phone || '';
      }
    }
    else {
      delete enrichedListing.property_value;
      throwIfNotAllowed(listing);
    }

    delete enrichedListing.rent_lead_by;
    return enrichedListing;
  }

  return listing;
}

function throwIfNotAllowed(listing) {
  if (listing.status == 'rented' && !listing.show_for_future_booking) {
    throw new CustomError(403, 'Cant show rented listing. User is not a publisher of listingId: ' + listing.id);
  }
}

async function getRelatedListings(apartmentId, limit) {
  const listing = await listingRepository.getByApartmentId(apartmentId);

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

async function getValidationData(apartment, user) {
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

  const validationData = await listingRepository.list(undefined, queryOptions);
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

/*
  This method is invoked by an AWS monthly-report-lambda repo: https://github.com/dorbel-tech/monthly-report-lambda.
  First it calls listings repository to collect listing_ids and publishing_user_ids for:
  rented listings, with lease_end>now, publishing_user_type=landlord, lease_start day of month = this day of month.

  Then it iterates over each listing and publishes a message to SNS which being processed by notification-service to deliver the reports.
*/
async function sendMonthlyReports(day, month, year, user) {
  if (userPermissions.isUserAdmin(user)) {
    const momentJsMonth = month - 1;
    const reportDate = moment({ year, month: momentJsMonth, date: day });

    logger.info('Gettting monthly report data');
    const reportData = await listingRepository.getMonthlyReportData(reportDate, getMonthlyReportDays(reportDate));
    logger.info({ reportData }, 'Received monthly report data');

    reportData.map(reportDataItem =>
      messageBus.publish(process.env.NOTIFICATIONS_SNS_TOPIC_ARN, messageBus.eventType.SEND_MONTHLY_REPORT, {
        user_uuid: reportDataItem.publishing_user_id,
        listing_id: reportDataItem.id,
        day,
        month,
        year
      })
    );
  }
  else {
    throw new CustomError(403, 'You are not allowed to view this data');
  }
}

function getMonthlyReportDays(reportDate) {
  const reportDay = reportDate.date();

  if (reportDate.daysInMonth() == reportDay) {
    return _.range(reportDay, 32);
  }
  else {
    return [reportDay];
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
  sendMonthlyReports
};
