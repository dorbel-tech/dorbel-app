'use strict';
const errors = require('./domainErrors');
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');

function* find(eventId) {
  const existingEvent = yield openHouseEventsRepository.find(eventId);
  if (existingEvent == undefined) {
    throw new errors.DomainNotFoundError('OpenHouseEventNotFoundError',
      { event_id: eventId }, 
      'event does not exist');
  }

  return existingEvent;
}

function* findByListing(listingId) {
  return yield openHouseEventsRepository.findByListingId(listingId);
}

module.exports = {
  find,
  findByListing,
};
