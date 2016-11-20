'use strict';
const listingRepository = require('../apartmentDb/repositories/listingRepository');
const moment = require('moment');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

// TODO : errors thrown here return 500

function* create(listing) {
  if (!listing.images || !listing.images.length) {
    const error1 = new Error('listing must contain at least one image');
    logger.error(error1);
    throw error1;
  }

  if (!listing.open_house_events || !listing.open_house_events.length) {
    const error2 = new Error('listing must contain at least one open house event');
    logger.error(error2);
    throw error2;
  }

  const existingOpenListingForApartment = yield listingRepository.getListingsForApartment(listing.apartment, { status: { $notIn: ['closed', 'rented'] } });
  if (existingOpenListingForApartment && existingOpenListingForApartment.length) {
    const error3 = new Error('apartment already has an active listing');
    logger.error(error3);
    throw error3;
  }

  if (listing.lease_start && !listing.lease_end) {
    // Upload form sends only lease_start so we default lease_end to after one year 
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  return yield listingRepository.create(listing);
}

module.exports = {
  create,
  list: listingRepository.list
};
