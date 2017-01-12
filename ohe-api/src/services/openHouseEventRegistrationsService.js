'use strict';
const _ = require('lodash');
const errors = require('./domainErrors');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');
const shared = require('dorbel-shared');
const utilityFunctions = require('./common/utility-functions');
const userManagement = shared.utils.userManagement;
const generic = shared.utils.generic;
const logger = shared.logger.getLogger(module);

function* register(event_id, user) {
  let existingEvent = yield openHouseEventsFinderService.find(event_id);

  validateEventRegistration(existingEvent, user.user_id); // will throw error if validation fails

  const registration = {
    open_house_event_id: event_id,
    registered_user_id: user.user_id,
    is_active: true
  };

  const result = yield repository.createRegistration(registration);
  logger.info({ event_id: event_id, user_id: user.user_id }, 'Register to OHE');

  let userMetadata = {
    first_name: user.firstname,
    email: user.email,
    phone: generic.normalizePhone(user.phone)
  };
  // TODO: Update user details can be done on client using user token.
  userManagement.updateUserDetails(user.user_id, {
    user_metadata: userMetadata
  });

  notificationService.send(notificationService.eventType.OHE_REGISTERED, {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    user_uuid: user.user_id,
    user_profile: userMetadata
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
  logger.info({ 
    event_id: existingRegistration.open_house_event_id, 
    user_id: existingRegistration.registered_user_id 
  }, 'Unregister to OHE');

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
  const eventStatus = utilityFunctions.calculateOHEStatus(event, user_id);

  let errorMessage;

  switch (eventStatus) {
    case 'open':
      break;
    case 'expired':
      errorMessage = 'cannot register to past event';
      break;
    case 'full':
      errorMessage = 'event is full';
      break;
    case 'registered':
      errorMessage = 'user already registered to this event';
      break;
    case 'late':
      errorMessage = 'to late to register';
  }

  if (errorMessage) {
    throw new errors.DomainValidationError('OpenHouseEventRegistrationValidationError',
      { event_id: event.id, user_id: user_id }, errorMessage);
  }
}

module.exports = {
  register,
  unregister,
  isUserRegisteredToEvent
};
