'use strict';
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const moment = require('moment');
require('moment-range');

function OpenHouseEventValidationError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

function OpenHouseEventNotFoundError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

function validateEventParamters(listing_id, start, end) {
  if (end.diff(start, 'minutes') < 30) {
    throw new OpenHouseEventValidationError('open house event should be at least 30 minutes');
  }
}

function validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end) {
  if (!existingListingEvents) {
    return;
  }
  existingListingEvents.forEach(function (existingEvent) {
    const range = moment.range(existingEvent.start_time, existingEvent.end_time);
    if (range.contains(start) || range.contains(end)) {
      throw new OpenHouseEventValidationError('new event is overlapping an existing event');
    }
  });
}

function* list(listingId){
  return yield openHouseEventsRepository.findByListingId(listingId);
}

function* find(eventId) {
  const existingEvent = yield openHouseEventsRepository.find(eventId);
  if (existingEvent == undefined) {
    throw new OpenHouseEventNotFoundError('event does not exist');
  }

  return existingEvent;
}

function* create(openHouseEvent) {

  const listing_id = parseInt(openHouseEvent.listing_id);
  const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
  const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);

  validateEventParamters(listing_id, start, end);

  const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
  validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end);

  return yield openHouseEventsRepository.create({
    start_time: start,
    end_time: end,
    listing_id: listing_id,
    is_active: true
  });
}

function* update(openHouseEvent) {
  let existingEvent = yield find(openHouseEvent.id);

  const listing_id = parseInt(openHouseEvent.listing_id);
  const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
  const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);
  validateEventParamters(listing_id, start, end);

  const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
  const existingEventsWithoutCurrent = existingListingEvents.filter(function (existingEvent) {
    return existingEvent.id != openHouseEvent.id;
  });

  validateEventIsNotNotOverlappingExistingEvents(existingEventsWithoutCurrent, listing_id, start, end);

  existingEvent.start_time = start;
  existingEvent.start_time = end;

  return yield openHouseEventsRepository.update(existingEvent);
}

function* remove(eventId) {
  let existingEvent = yield find(eventId);
  existingEvent.is_active = false;
  return yield openHouseEventsRepository.update(existingEvent);
}

function* register(eventId, userId) {
  let existingEvent = yield find(eventId);
  if (existingEvent.registrations) {
    existingEvent.registrations.forEach(function (registration) {
      if (registration.user_id == userId) {
        throw new OpenHouseEventValidationError('user already registered to this event');
      }
    });
  }

  const registration = {
    open_house_event_id: eventId,
    user_id: userId,
    is_active: true
  };
  return yield openHouseEventsRepository.createRegistration(registration);
}

function* unregister(registrationId) {
  let existingRegistration = yield openHouseEventsRepository.findRegistration(registrationId);
  if (existingRegistration == undefined) {
    throw new OpenHouseEventNotFoundError('registration does not exist');
  }
  existingRegistration.is_active = false;
  return yield openHouseEventsRepository.updateRegistration(existingRegistration);
}

module.exports = {
  list,
  find,
  create,
  update,
  remove,
  register,
  unregister,
  OpenHouseEventValidationError,
  OpenHouseEventNotFoundError
};
