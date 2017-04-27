'use strict';
const _ = require('lodash');
const notificationService = require('./notificationService');
const openHouseEventsFinderService = require('./openHouseEventsFinderService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');
const shared = require('dorbel-shared');
const errors = shared.utils.domainErrors;
const utilityFunctions = require('./common/utility-functions');
const userManagement = shared.utils.userManagement;
const generic = shared.utils.generic;
const logger = shared.logger.getLogger(module);

function* register(event_id, user) {
  let existingEvent = yield openHouseEventsFinderService.find(event_id);
  let usersOwnRegistration = existingEvent.registrations && _.find(existingEvent.registrations, { registered_user_id: user.user_id });    

  validateEventRegistration(existingEvent, user.user_id); // will throw error if validation fails

  let result;

  if (usersOwnRegistration) {
    usersOwnRegistration.is_active = true; // if we passed validation user's own registration is not active
    result = yield repository.updateRegistration(usersOwnRegistration);
  } else {
    const registration = {
      open_house_event_id: event_id,
      registered_user_id: user.user_id,
      is_active: true
    };

    result = yield repository.createRegistration(registration);
  }

  logger.info({ event_id, user_uuid: user.user_id }, 'Register to OHE');

  let userMetadata = {
    first_name: user.firstname,
    email: user.email,
    phone: generic.normalizePhone(user.phone)
  };

  logger.debug({ user_uuid: user.user_id, userMetadata }, 'Before calling updateUserDetails');

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

function* unregister(event_id, user) {
  let existingRegistration = yield repository.findRegistration(event_id, user.id);
  if (existingRegistration == undefined) {
    throw new errors.DomainNotFoundError('OpenHouseEventRegistrationNotFoundError',
      { ohe_id: event_id, user_uuid: user.id },
      'רישום לא קיים');
  }

  utilityFunctions.validateResourceOwnership(existingRegistration.registered_user_id, user);

  existingRegistration.is_active = false;
  const result = yield repository.updateRegistration(existingRegistration);

  logger.info({
    event_id: existingRegistration.open_house_event_id,
    user_uuid: existingRegistration.registered_user_id
  }, 'Unregister to OHE');

  let existingEvent = yield openHouseEventsFinderService.find(existingRegistration.open_house_event_id);
  
  if (existingEvent) {
    notificationService.send(notificationService.eventType.OHE_UNREGISTERED, {
      listing_id: existingEvent.listing_id,
      event_id: existingEvent.id,
      user_uuid: existingRegistration.registered_user_id
    });
  }

  return result;
}

function validateEventRegistration(event, user_id) {
  const eventStatus = utilityFunctions.calculateOHEStatus(event, user_id);

  let errorMessage;

  switch (eventStatus) {
    case 'open':
      break;
    case 'expired':
      errorMessage = 'לא ניתן להרשם לאירועים שחלפו';
      break;
    case 'full':
      errorMessage = 'האירוע מלא';
      break;
    case 'registered':
      errorMessage = 'המשתמש כבר רשום לאירוע זה';
      break;
    case 'late':
      errorMessage = 'מאוחר מדי להרשם, האירוע הולך להתחיל בקרוב';
  }

  if (errorMessage) {
    throw new errors.DomainValidationError('OpenHouseEventRegistrationValidationError',
      { event_id: event.id, user_uuid: user_id }, errorMessage);
  }
}

module.exports = {
  register,
  unregister
};
