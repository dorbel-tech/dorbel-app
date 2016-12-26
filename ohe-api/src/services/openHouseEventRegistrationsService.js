'use strict';
const _ = require('lodash');
const moment = require('moment');
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');

const CLOSE_EVENT_IF_TOO_SOON_AND_NO_REGISTRATIONS_MINUTES = 90;

function* register(event_id, user_id) {
  let existingEvent = yield openHouseEventsFinderService.find(event_id);
  let errorMessage;

  if (isUserRegisteredToEvent(existingEvent, user_id)) {
    errorMessage = 'user already registered to this event';
  } else if (!isEventOpenForRegistrations(existingEvent)) {
    errorMessage = 'event is not open for registration';
  }

  if (errorMessage) {
    throw new errors.DomainValidationError('OpenHouseEventRegistrationValidationError',
      { event_id, registered_user_id: user_id }, errorMessage);
  }

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

  notificationService.send(notificationService.eventType.OHE_UNREGISTERED, {
    event_id: existingRegistration.id,
    user_uuid: existingRegistration.registered_user_id
  });

  return result;
}

function isEventOpenForRegistrations(event) {
  if (event.registrations.length === 0 && moment().add(CLOSE_EVENT_IF_TOO_SOON_AND_NO_REGISTRATIONS_MINUTES, 'minutes').isAfter(event.start_time)) {
    return false;
  }
  
  return true;
}

function isUserRegisteredToEvent(event, userId) {
  if (event.registrations) {
    let userIsRegistered = _.find(event.registrations, { registered_user_id: userId });
    return !!userIsRegistered;
  }

  return false;
}

module.exports = {
  register,
  unregister,
  isEventOpenForRegistrations
};
