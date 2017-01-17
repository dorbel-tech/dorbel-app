'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const utilityFunctions = require('./common/utility-functions');
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const moment = require('moment');
require('moment-range');

function validateEventParamters(start, end) {
  if (end.diff(start, 'minutes') < 30) {
    throw new errors.DomainValidationError('OpenHouseEventValidationError', {
      start_time: start,
      end_time: end
    }, 'open house event should be at least 30 minutes');
  }
}

function validateEventOverlap(existingListingEvents, start, end) {
  if (!existingListingEvents) {
    return;
  }
  existingListingEvents
    .forEach(function (existingEvent) {
      const range = moment.range(existingEvent.start_time, existingEvent.end_time);
      if (range.contains(start) || range.contains(end)) {
        throw new errors.DomainValidationError('OpenHouseEventValidationError', {
          start_time: start,
          end_time: end
        }, 'new event is overlapping an existing event');
      }
    });
}

function* create(openHouseEvent) {

  const listing_id = parseInt(openHouseEvent.listing_id);
  const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
  const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);
  const max_attendies = parseInt(openHouseEvent.max_attendies);

  validateEventParamters(start, end);

  const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
  validateEventOverlap(existingListingEvents, start, end);

  const newEvent = yield openHouseEventsRepository.create({
    start_time: start,
    end_time: end,
    listing_id: listing_id,
    comments: openHouseEvent.comments,
    publishing_user_id: openHouseEvent.publishing_user_id,
    is_active: true,
    max_attendies
  });
  logger.info(newEvent, 'OHE created');

  notificationService.send(notificationService.eventType.OHE_CREATED, {
    listing_id: listing_id,
    event_id: newEvent.id,
    start_time: start,
    end_time: end,
    comments: openHouseEvent.comments,
    user_uuid: openHouseEvent.publishing_user_id
  });


  return newEvent;
}

function* update(id, updateRequest, user) {
  let existingEvent = yield openHouseEventsFinderService.find(id);

  if (existingEvent.publishing_user_id !== user.id) { throw new errors.NotResourceOwnerError(); }

  const start = moment(updateRequest.start_time || existingEvent.start_time, moment.ISO_8601, true);
  const end = moment(updateRequest.end_time || existingEvent.end_time, moment.ISO_8601, true);

  if (start.toDate().toDateString() !== existingEvent.start_time.toDateString() ||
      end.toDate().toDateString() !== existingEvent.end_time.toDateString()) {
    throw new errors.DomainValidationError('OpenHouseEventValidationError', {}, 'not allowed to edit day');
  }

  const timeChanged = !start.isSame(existingEvent.start_time) || !end.isSame(existingEvent.end_time);

  if (!timeChanged && existingEvent.max_attendies === updateRequest.max_attendies) {
    // no changed
    return existingEvent;
  }

  validateEventParamters(start, end);

  const existingListingEvents = yield openHouseEventsFinderService.findByListing(existingEvent.listing_id);
  const otherEvents = existingListingEvents.filter(otherEvent => otherEvent.id !== id && otherEvent.is_active);
  validateEventOverlap(otherEvents, start, end);

  existingEvent.start_time = start;
  existingEvent.end_time = end;
  existingEvent.max_attendies = updateRequest.max_attendies;

  let result = yield openHouseEventsRepository.update(existingEvent);
  if (result.toJSON) {
    result = result.toJSON();
  }
  logger.info(result, 'OHE updated');

  if (timeChanged) {
    notificationService.send(notificationService.eventType.OHE_UPDATED, {
      listing_id: existingEvent.listing_id,
      event_id: existingEvent.id,
      old_start_time: existingEvent.start_time,
      old_end_time: existingEvent.end_time,
      new_start_time: start,
      new_end_time: end,
      user_uuid: existingEvent.publishing_user_id
    });
  }

  return result;
}

function* remove(eventId, user) {
  let existingEvent = yield openHouseEventsFinderService.find(eventId);

  if (existingEvent.publishing_user_id !== user.id) { throw new errors.NotResourceOwnerError(); }

  existingEvent.is_active = false;

  const result = yield openHouseEventsRepository.update(existingEvent);
  logger.info(result, 'OHE marked as inactive');

  notificationService.send(notificationService.eventType.OHE_DELETED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    start_time: existingEvent.start_time,
    end_time: existingEvent.end_time,
    comments: existingEvent.comments,
    user_uuid: existingEvent.publishing_user_id
  });

  return result;
}

function* findByListing(listing_id, user) {
  let events = yield openHouseEventsFinderService.findByListing(listing_id);
  let promises = [];

  const userId = user ? user.id : undefined;

  events = events.map(event => {
    const eventJson = event.toJSON();
    const eventDto = convertEventModelToDTO(eventJson, userId);

    if (userId == event.publishing_user_id) { // publishing user
      // get all the data about the registrations *TODO*: move to seperate api call
      eventDto.registrations = eventJson.registrations;
      eventDto.registrations.forEach(registration => {
        const promiseForUser = shared.utils.userManagement.getPublicProfile(registration.registered_user_id)
          .then(user => registration.user = user);
        promises.push(promiseForUser);
      });
    }
    return eventDto;
  });

  yield promises; // wait for it
  return events;
}

function convertEventModelToDTO(eventModel, userId) {
  return {
    id: eventModel.id,
    listing_id: eventModel.listing_id,
    start_time: eventModel.start_time,
    end_time: eventModel.end_time,
    max_attendies: eventModel.max_attendies,
    comments: eventModel.comments,
    status: utilityFunctions.calculateOHEStatus(eventModel, userId)
  };
}

module.exports = {
  create,
  update,
  remove,
  findByListing
};
