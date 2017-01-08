'use strict';
const shared = require('dorbel-shared');
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const _ = require('lodash');
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
  const max_attendies = parseInt(openHouseEvent.max_attendies);

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
    max_attendies
  });

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
    new_comments: openHouseEvent.comments,
    user_uuid: existingEvent.publishing_user_id
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
    comments: existingEvent.comments,
    user_uuid: existingEvent.publishing_user_id
  });

  return result;
}

function* findByListing(listing_id, user) {
  let events = yield openHouseEventsFinderService.findByListing(listing_id);
  let promises = [];

  events = events.map(event => {
    event = event.toJSON(); // getting rid of sequelize wrapper

    if (user) { // any user      
      // includes the user own registration so he will know he registered and also how to un-register
      event.usersOwnRegistration = _.find(event.registrations, { registered_user_id: user.id });
    }

    if (user && user.id === event.publishing_user_id) { // publishing user
      // get all the data about the registrations
      // *TODO*: move to seperate api call
      event.registrations.forEach(registration => {
        const promiseForUser = shared.utils.userManagement.getPublicProfile(registration.registered_user_id)
          .then(user => registration.user = user);
        promises.push(promiseForUser);
      });
    } else {
      // only publisher can get registrations info
      event.registrations = new Array(event.registrations.length); 
    }
    
    return event;
  });

  yield promises; // wait for it
  return events;
}

module.exports = {
  create,
  update,
  remove,
  findByListing
};
