'use strict';
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');

function OpenHouseEventRegistrationValidationError(eventId, userId, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.eventId = eventId;
  this.userId = userId;
}

function OpenHouseEventRegistrationNotFoundError(registrationId, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.registrationId = registrationId;
}

function* register(eventId, userId) {
  let existingEvent = yield openHouseEventsFinderService.find(eventId);
  if (existingEvent.registrations) {
    existingEvent.registrations.forEach(function (registration) {
      if (registration.user_id == userId) {
        throw new OpenHouseEventRegistrationValidationError(eventId, userId, 'user already registered to this event');
      }
    });
  }

  const registration = {
    open_house_event_id: eventId,
    user_id: userId,
    is_active: true
  };

  const result = yield repository.createRegistration(registration);

  notificationService.send(notificationService.eventType.OHE_REGISTERED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    registered_user_id: userId
  });

  return result;
}

function* unregister(registrationId) {
  let existingRegistration = yield repository.findRegistration(registrationId);
  if (existingRegistration == undefined) {
    throw new OpenHouseEventRegistrationNotFoundError(registrationId, 'registration does not exist');
  }
  existingRegistration.is_active = false;

  const result = yield repository.updateRegistration(existingRegistration);

  notificationService.send(notificationService.eventType.OHE_UNREGISTERED, {
    event_id: existingRegistration.id,
    registered_user_id: existingRegistration.user_id
  });

  return result;
}

module.exports = {
  register,
  unregister,
  OpenHouseEventRegistrationValidationError,
  OpenHouseEventRegistrationNotFoundError
};
