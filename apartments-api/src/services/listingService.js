'use strict';
const shared = require('dorbel-shared');
const config = shared.config; 
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');

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

  let modifiedListing = yield setGeoLocation(listing);
  let createdListing = yield listingRepository.create(modifiedListing);
  
  // Publish event trigger message to SNS for notifications dispatching.
  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, { 
      user_uuid: createdListing.publishing_user_id,
      apartment_id: createdListing.apartment_id    
    });
  }

  return createdListing;
}

function* setGeoLocation(listing) {
  const options = { provider: 'google'};
  const geocoder = NodeGeocoder(options);
  let fullAddress = [  
    listing.apartment.building.street_name,
    listing.apartment.building.house_number,
    listing.apartment.building.city.city_name
  ].join(' '); // Full address in one string with spacing.
  return geocoder.geocode(fullAddress)
    .then(res => {
      logger.debug({ res }, 'Got geo location of apartment.');
      var point = { type: 'Point', coordinates: [ res[0].longitude, res[0].latitude ]};
      listing.apartment.building.geolocation = point;
      return listing;

    })
    .catch(err => {
      logger.error(err, 'Cant get geo location of apartment.');
      return listing;
    });
}

module.exports = {
  create,
  list: listingRepository.list,
  getById: listingRepository.getById
};
