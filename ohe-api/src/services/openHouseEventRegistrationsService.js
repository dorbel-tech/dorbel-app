'use strict';
const _ = require('lodash');
const moment = require('moment');
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');

const CLOSE_EVENT_IF_TOO_CLOSE = 90;

function* register(event_id, user_id) {
  let existingEvent = yield openHouseEventsFinderService.find(event_id);

  validateEventRegistration(existingEvent, user_id); // will throw error if validation fails

  const registration = {
    open_house_event_id: event_id,
    registered_user_id: user_id,
    is_active: true
  };



  const result = yield repository.createRegistration(registration);

  notificationService.send(notificationService.eventType.OHE_REGISTERED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    user_uuid: user_id
  });

  return result;
}

function* unregister(registrationId) {
  let existingRegistration = yield repository.findRegistration(registrationId);
  if (existingRegistration == undefined) {
    throw new errors.DomainNotFoundError('OpenHouseEventRegistrationNotFoundError',
      { registration_id: registrationId },
      'registration does not exist');
  }
  existingRegistration.is_active = false;

  const result = yield repository.updateRegistration(existingRegistration);
  let existingEvent = yield openHouseEventsFinderService.find(existingRegistration.open_house_event_id);

  notificationService.send(notificationService.eventType.OHE_UNREGISTERED, {
    listing_id: existingEvent.listing_id,
    event_id: existingRegistration.id,
    user_uuid: existingRegistration.registered_user_id
  });

  return result;
}

function isUserRegisteredToEvent(event, userId) {
  if (event.registrations) {
    let userIsRegistered = _.find(event.registrations, { registered_user_id: userId });
    return !!userIsRegistered;
  }

  return false;
}

function validateEventRegistration(event, user_id) {
  let errorMessage;

  if (isUserRegisteredToEvent(event, user_id)) {
    errorMessage = 'user already registered to this event';
  } 
  else if (moment().isAfter(event.start_time)) {
    errorMessage = 'cannot register to past event';
  } 
  else if (event.num_of_registrations >= event.max_attendies) {
    errorMessage = 'event is full';
  } 
  else if (event.num_of_registrations === 0) { // 0 registrations and too close to event
    const eventTooSoon = moment().add(CLOSE_EVENT_IF_TOO_CLOSE, 'minutes').isAfter(event.start_time);
    if (eventTooSoon) {
      errorMessage = 'to late to register';
    }
  }

  if (errorMessage) {
    throw new errors.DomainValidationError('OpenHouseEventRegistrationValidationError',
      { event_id: event.id, registered_user_id: user_id }, errorMessage);
  }
}

module.exports = {
  register,
  unregister,
  isUserRegisteredToEvent
};
