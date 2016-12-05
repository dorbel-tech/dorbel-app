'use strict';
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');

function OpenHouseEventNotFoundError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

function* find(eventId) {
  const existingEvent = yield openHouseEventsRepository.find(eventId);
  if (existingEvent == undefined) {
    throw new OpenHouseEventNotFoundError('event does not exist');
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
