'use strict';
const _ = require('lodash');
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');
const shared = require('dorbel-shared');
const userManagement = shared.utils.userManagement;
const generic = shared.utils.generic;

function* register(event_id, user) {
  let existingEvent = yield openHouseEventsFinderService.find(event_id);
  let errorMessage;

  if (isUserRegisteredToEvent(existingEvent, user.user_id)) {
    errorMessage = 'user already registered to this event';
  } else if (!existingEvent.isOpenForRegistration) {
    errorMessage = 'event is not open for registration';
  }

  if (errorMessage) {
    throw new errors.DomainValidationError('OpenHouseEventRegistrationValidationError',
      { event_id, registered_user_id: user.user_id }, errorMessage);
  }

  const registration = {
    open_house_event_id: event_id,
    registered_user_id: user.user_id,
    is_active: true
  };

  const result = yield repository.createRegistration(registration);

  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(user.user_id, {
    user_metadata: {
      first_name: user.firstname,
      email: user.email,
      phone: generic.normalizePhone(user.phone)
    }
  });
  
  notificationService.send(notificationService.eventType.OHE_REGISTERED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    user_uuid: user.user_id
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

module.exports = {
  register,
  unregister,
  isUserRegisteredToEvent
};
