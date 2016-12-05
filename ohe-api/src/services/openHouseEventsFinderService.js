'use strict';
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');

function OpenHouseEventNotFoundError(eventId, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.eventId = eventId;
}

function* find(eventId) {
  const existingEvent = yield openHouseEventsRepository.find(eventId);
  if (existingEvent == undefined) {
    throw new OpenHouseEventNotFoundError(eventId, 'event does not exist');
  }

  return existingEvent;
}

function* findByListing(listingId) {
  return yield openHouseEventsRepository.findByListingId(listingId);
}

module.exports = {
  find,
  findByListing,
  OpenHouseEventNotFoundError
};
