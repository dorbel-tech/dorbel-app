'use strict';
const notificationService = require('./notificationService');
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

function validateEventIsNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end) {
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
  validateEventIsNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end);

  const newEvent = yield openHouseEventsRepository.create({
    start_time: start,
    end_time: end,
    listing_id: listing_id,
    is_active: true
  });

  notificationService.send('OHE_CREATED', {
    listing_id: listing_id,
    event_id: newEvent.id,
    start_time: start,
    end_time: end
  });

  return newEvent;
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

  validateEventIsNotOverlappingExistingEvents(existingEventsWithoutCurrent, listing_id, start, end);

  existingEvent.start_time = start;
  existingEvent.start_time = end;

  const result = yield openHouseEventsRepository.update(existingEvent);

  notificationService.send('OHE_UPDATED', {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    old_start_time: existingEvent.start_time,
    old_end_time: existingEvent.end_time,
    new_start_time: start,
    new_end_time: end,
  });

  return result;
}

function* remove(eventId) {
  let existingEvent = yield find(eventId);
  existingEvent.is_active = false;

  const result = yield openHouseEventsRepository.update(existingEvent);

  notificationService.send('OHE_DELETED', {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    start_time: existingEvent.start_time,
    end_time: existingEvent.end_time
  });

  return result;
}

module.exports = {
  find,
  create,
  update,
  remove,
  OpenHouseEventValidationError,
  OpenHouseEventNotFoundError
};
