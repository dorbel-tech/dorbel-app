'use strict';
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');

function* register(eventId, userId) {
  let existingEvent = yield openHouseEventsFinderService.find(eventId);
  if (existingEvent.registrations) {
    existingEvent.registrations.forEach(function (registration) {
      if (registration.registered_user_id == userId) {
        throw new errors.DomainValidationError('OpenHouseEventRegistrationValidationError',
          { event_id: eventId, registered_user_id: userId },
          'user already registered to this event');
      }
    });
  }

  const registration = {
    open_house_event_id: eventId,
    registered_user_id: userId,
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
    throw new errors.DomainNotFoundError('OpenHouseEventRegistrationNotFoundError',
      { registration_id: registrationId },
      'registration does not exist');
  }
  existingRegistration.is_active = false;

  const result = yield repository.updateRegistration(existingRegistration);

  notificationService.send(notificationService.eventType.OHE_UNREGISTERED, {
    event_id: existingRegistration.id,
    registered_user_id: existingRegistration.registered_user_id
  });

  return result;
}

module.exports = {
  register,
  unregister
};
