'use strict';
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const moment = require('moment');
require('moment-range');

function validateEventParamters(start, end) {
  if (end.diff(start, 'minutes') < 30) {
    throw new errors.DomainValidationError('OpenHouseEventValidationError',
      { start_time: start, end_time: end },
      'open house event should be at least 30 minutes');
  }
}

function validateEventIsNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end) {
  if (!existingListingEvents) {
    return;
  }
  existingListingEvents.forEach(function (existingEvent) {
    const range = moment.range(existingEvent.start_time, existingEvent.end_time);
    if (range.contains(start) || range.contains(end)) {
      throw new errors.DomainValidationError('OpenHouseEventValidationError',
        { start_time: start, end_time: end },
        'new event is overlapping an existing event');
    }
  });
}

function* create(openHouseEvent) {

  const listing_id = parseInt(openHouseEvent.listing_id);
  const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
  const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);

  validateEventParamters(start, end);

  const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
  validateEventIsNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end);

  const newEvent = yield openHouseEventsRepository.create({
    start_time: start,
    end_time: end,
    listing_id: listing_id,
    comments: openHouseEvent.comments,
    publishing_user_id: openHouseEvent.publishing_user_id,
    is_active: true,
  });

  notificationService.send(notificationService.eventType.OHE_CREATED, {
    listing_id: listing_id,
    event_id: newEvent.id,
    start_time: start,
    end_time: end,
    comments: openHouseEvent.comments,
    publishing_user_id: openHouseEvent.publishing_user_id
  });

  return newEvent;
}

function* update(openHouseEvent) {
  let existingEvent = yield openHouseEventsFinderService.find(openHouseEvent.id);

  const listing_id = parseInt(openHouseEvent.listing_id);
  const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
  const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);
  validateEventParamters(start, end);

  const existingListingEvents = yield openHouseEventsFinderService.findByListing(listing_id);
  const existingEventsWithoutCurrent = existingListingEvents.filter(function (existingEvent) {
    return existingEvent.id != openHouseEvent.id;
  });

  validateEventIsNotOverlappingExistingEvents(existingEventsWithoutCurrent, listing_id, start, end);

  existingEvent.start_time = start;
  existingEvent.start_time = end;
  existingEvent.comments = openHouseEvent.comments;

  const result = yield openHouseEventsRepository.update(existingEvent);

  notificationService.send(notificationService.eventType.OHE_UPDATED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    old_start_time: existingEvent.start_time,
    old_end_time: existingEvent.end_time,
    old_comments: existingEvent.comments,
    new_start_time: start,
    new_end_time: end,
    new_comments: openHouseEvent.comments
  });

  return result;
}

function* remove(eventId) {
  let existingEvent = yield openHouseEventsFinderService.find(eventId);
  existingEvent.is_active = false;

  const result = yield openHouseEventsRepository.update(existingEvent);

  notificationService.send(notificationService.eventType.OHE_DELETED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    start_time: existingEvent.start_time,
    end_time: existingEvent.end_time,
    comments: existingEvent.comments    
  });

  return result;
}

module.exports = {
  create,
  update,
  remove
};
