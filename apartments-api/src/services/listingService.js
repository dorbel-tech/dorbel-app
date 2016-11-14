'use strict';
const listingRepository = require('../apartmentDb/repositories/listingRepository');

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
    let oneMoreYear = new Date(listing.lease_start);
    oneMoreYear.setYear(oneMoreYear.getFullYear() + 1); // one year default
    listing.lease_end = oneMoreYear.toJSON().substr(0,10); 
  }

  return yield listingRepository.create(listing);
}

module.exports = {
  create,
  list: listingRepository.list
};
