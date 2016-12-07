'use strict';
const util = require('util');
const shared = require('dorbel-shared');
const config = shared.config;
const messageBus = shared.utils.messageBus;
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const moment = require('moment');
const geoService = require('./geoService');
const userManagement = shared.utils.userManagement;
const oheApiClient = require('./oheApiClient');

// TODO : move this to dorbel-shared
function CustomError(code, message) {
  let error = new Error(message);
  error.status = code;
  return error;
}

function* create(listing) {
  const existingOpenListingForApartment = yield listingRepository.getListingsForApartment(listing.apartment, { status: { $notIn: ['closed', 'rented'] } });
  if (existingOpenListingForApartment && existingOpenListingForApartment.length) {
    throw new CustomError(409, 'apartment already has an active listing');
  }

  if (listing.lease_start && !listing.lease_end) {
    // Upload form sends only lease_start so we default lease_end to after one year 
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  let modifiedListing = yield geoService.setGeoLocation(listing);
  let createdListing = yield listingRepository.create(modifiedListing); 

  // Update user phone number in auth0.
  let normalizedPhone = normalizePhone(listing.user.phone);
  userManagement.updateUserDetails(createdListing.publishing_user_id, {
    user_metadata: { 
      phone: normalizedPhone 
    }
  });

  const userProfile = JSON.stringify({ id: createdListing.publishing_user_id });
  const start = buildTimeString(listing.ohe_date, listing.ohe_start_time);
  const end = buildTimeString(listing.ohe_date, listing.ohe_end_time);

  oheApiClient.createOpenHouseEvent(userProfile, createdListing.id,start, end);

  // Publish event trigger message to SNS for notifications dispatching.
  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    let fullName = listing.user.firstname + ' ' + listing.user.lastname;
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, { 
      user_uuid: createdListing.publishing_user_id,
      user_email: listing.user.email,
      user_phone: normalizedPhone,
      user_full_name: fullName,
      apartment_id: createdListing.apartment_id      
    });
  }

  return createdListing;
}

function normalizePhone(phone) {
  if (phone.startsWith('0')) { 
    return '+972' + phone.substring(1).replace(/[-+()]/g, ''); // remove trailing zero, remove special chars.
  } else {
    return phone;
  }
}

function buildTimeString(eventDate, eventTime) {
  return moment(util.format('%sT%s', eventDate, eventTime)).toISOString();
}

module.exports = {
  create,
  list: listingRepository.list,
  getById: listingRepository.getById
};
