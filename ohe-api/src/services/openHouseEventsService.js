'use strict';
const shared = require('dorbel-shared');
const errors = shared.utils.domainErrors;
const logger = shared.logger.getLogger(module);
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const moment = require('moment'); require('moment-range');
const userManagement = shared.utils.user.management;
const userPermissions = shared.utils.user.permissions;
const utilityFunctions = require('./common/utility-functions');

function validateEventParamters(start, end) {
  if (end.diff(start, 'minutes') < 30) {
    throw new errors.DomainValidationError('OpenHouseEventValidationError', {
      start_time: start,
      end_time: end
    }, 'מינימום זמן לביקור הוא 30 דקות');
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
        }, 'כבר קיים מועד ביקור בתאריך ובשעה שבחרתם. אנא בחרו תאריך ו/או שעה אחרים');
      }
    });
}

async function create(openHouseEvent, user) {
  const userId = openHouseEvent.listing_publishing_user_id || openHouseEvent.publishing_user_id;
  userPermissions.validateResourceOwnership(user, userId);

  const apartment_id = parseInt(openHouseEvent.apartment_id);
  const listing_id = parseInt(openHouseEvent.listing_id);
  const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
  const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);
  const max_attendies = parseInt(openHouseEvent.max_attendies);

  validateEventParamters(start, end);

  const existingListingEvents = await openHouseEventsRepository.findByListingId(listing_id);
  validateEventOverlap(existingListingEvents, start, end);

  const newEvent = await openHouseEventsRepository.create({
    listing_id: listing_id,
    publishing_user_id: userId,
    start_time: start,
    end_time: end,
    status: 'active',
    max_attendies
  });
  logger.info({ user_uuid: userId, event_id: newEvent.id }, 'OHE created');

  notificationService.send(notificationService.eventType.OHE_CREATED, {
    apartment_id: apartment_id,
    listing_id: listing_id,
    event_id: newEvent.id,
    start_time: openHouseEvent.start_time,
    end_time: openHouseEvent.end_time,
    user_uuid: userId
  });


  return newEvent;
}

async function update(id, updateRequest, user) {
  const existingEvent = await openHouseEventsFinderService.find(id);
  const old_start_time = existingEvent.start_time;
  const old_end_time = existingEvent.end_time;

  userPermissions.validateResourceOwnership(user, existingEvent.publishing_user_id);

  const start = moment(updateRequest.start_time || existingEvent.start_time, moment.ISO_8601, true);
  const end = moment(updateRequest.end_time || existingEvent.end_time, moment.ISO_8601, true);

  if (start.toDate().toDateString() !== existingEvent.start_time.toDateString() ||
      end.toDate().toDateString() !== existingEvent.end_time.toDateString()) {
    throw new errors.DomainValidationError('OpenHouseEventValidationError', {}, 'לא ניתן לערוך תאריך לאירוע');
  }

  const timeChanged = !start.isSame(existingEvent.start_time) || !end.isSame(existingEvent.end_time);

  if (!timeChanged && existingEvent.max_attendies === updateRequest.max_attendies) {
    // no changed
    return existingEvent;
  }

  validateEventParamters(start, end);

  const existingListingEvents = await openHouseEventsRepository.findByListingId(existingEvent.listing_id);
  const otherEvents = existingListingEvents.filter(otherEvent => otherEvent.id !== id && otherEvent.status === 'active');
  validateEventOverlap(otherEvents, start, end);

  existingEvent.start_time = start;
  existingEvent.end_time = end;
  existingEvent.max_attendies = updateRequest.max_attendies;

  const result = await openHouseEventsRepository.update(existingEvent);
  logger.info({ user_uuid: existingEvent.publishing_user_id, event_id: existingEvent.id }, 'OHE updated');

  if (timeChanged) {
    notificationService.send(notificationService.eventType.OHE_UPDATED, {
      listing_id: existingEvent.listing_id,
      event_id: existingEvent.id,
      old_start_time: old_start_time,
      old_end_time: old_end_time,
      user_uuid: existingEvent.publishing_user_id
    });
  }

  return result;
}

function remove(eventId, user) {
  return updateStatus(eventId, user, 'deleted');
}

function deactivate(eventId, user) {
  return updateStatus(eventId, user, 'inactive');
}

async function updateStatus(eventId, user, status) {
  let existingEvent = await openHouseEventsFinderService.find(eventId);

  userPermissions.validateResourceOwnership(user, existingEvent.publishing_user_id);
  const oldStatus = existingEvent.status;

  existingEvent.status = status;

  const result = await openHouseEventsRepository.update(existingEvent);
  logger.info({ user_uuid: existingEvent.publishing_user_id, event_id: existingEvent.id, old_satus: oldStatus, new_status: status }, 'OHE status changed');

  let eventType;
  switch (status) {
    case 'inactive':
      eventType = notificationService.eventType.OHE_DEACTIVATED;
      break;
    case 'deleted':
      eventType = notificationService.eventType.OHE_DELETED;
      break;
  }

  notificationService.send(eventType, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    start_time: existingEvent.start_time,
    end_time: existingEvent.end_time,
    user_uuid: existingEvent.publishing_user_id
  });

  return result;
}

async function findByListing(listing_ids, user, additionalQuery) {
  let events = await openHouseEventsRepository.find(Object.assign({ listing_id: listing_ids }, additionalQuery));
  let promises = [];

  const userId = user ? user.id : undefined;

  events = events.map(event => {
    const eventJson = event.toJSON();
    const eventDto = convertEventModelToDTO(eventJson, userId);

    if (userId === event.publishing_user_id || userPermissions.isUserAdmin(user)) { // publishing user
      // get all the data about the registrations
      // TODO: move to seperate api call
      eventDto.registrations = eventJson.registrations;
      eventDto.registrations.forEach(registration => {
        const promiseForUser = userManagement.getPublicProfile(registration.registered_user_id)
          .then(user => registration.user = user);
        promises.push(promiseForUser);
      });
    }
    return eventDto;
  });

  await Promise.all(promises); // wait for it
  return events;
}

function convertEventModelToDTO(eventModel, userId) {
  return {
    id: eventModel.id,
    listing_id: eventModel.listing_id,
    start_time: eventModel.start_time,
    end_time: eventModel.end_time,
    max_attendies: eventModel.max_attendies,
    status: utilityFunctions.calculateOHEStatus(eventModel, userId)
  };
}

module.exports = {
  create,
  update,
  remove,
  findByListing,
  deactivate
};
