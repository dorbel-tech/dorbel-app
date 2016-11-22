'use strict';
const shared = require('dorbel-shared');
const config = shared.config; 
const messageBus = shared.utils.messageBus;
const listingRepository = require('../apartmentDb/repositories/listingRepository');
const moment = require('moment');

// TODO : errors thrown here return 500

function* create(listing) {
  if (!listing.images || !listing.images.length) {
    throw new Error('listing must contain at least one image');
  }

  if (!listing.open_house_events || !listing.open_house_events.length) {
    throw new Error('listing must contain at least one open house event');
  }

  const existingOpenListingForApartment = yield listingRepository.getListingsForApartment(listing.apartment, { status: { $notIn: ['closed', 'rented'] } });
  if (existingOpenListingForApartment && existingOpenListingForApartment.length) {
    throw new Error('apartment already has an active listing');
  }

  if (listing.lease_start && !listing.lease_end) {
    // Upload form sends only lease_start so we default lease_end to after one year 
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  let createdListing = yield listingRepository.create(listing);
  
  // Publish event trigger message to SNS for notifications dispatching.
  messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, { 
    user_uuid: createdListing.publishing_user_id,
    apartment_id: createdListing.apartment_id    
  });

  return createdListing;
}

module.exports = {
  create,
  list: listingRepository.list
};
