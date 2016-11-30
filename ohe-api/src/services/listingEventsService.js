'use strict';
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');

function* list(listingId) {
  return yield openHouseEventsRepository.findByListingId(listingId);
}

module.exports = {
  list
};