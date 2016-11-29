'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const config = shared.config;
const messageBus = shared.utils.messageBus;
const openHouseEventsService = require('./openHouseEventsService');
const repository = require('../openHouseEventsDb/repositories/openHouseEventRegistrationsRepository');

function OpenHouseEventRegistrationValidationError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

function OpenHouseEventRegistrationNotFoundError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

function sendNotification(messageType, data) {
  const topic = config.get('NOTIFICATIONS_SNS_TOPIC_ARN');
  if (topic == undefined) {
    logger.debug(data, 'notification not sent for %s - topic is undefined', messageType);
    return;
  }

  messageBus.publish(topic, messageBus.eventType[messageType], data);
}

function* register(eventId, userId) {
  let existingEvent = yield openHouseEventsService.find(eventId);
  if (existingEvent.registrations) {
    existingEvent.registrations.forEach(function (registration) {
      if (registration.user_id == userId) {
        throw new OpenHouseEventRegistrationValidationError('user already registered to this event');
      }
    });
  }

  const registration = {
    open_house_event_id: eventId,
    user_id: userId,
    is_active: true
  };

  const result = yield repository.createRegistration(registration);

  sendNotification('OHE_REGISTERED', {
    listing_id: existingEvent.listing_id,
    event_id: existingEvent.id,
    registered_user_id: userId
  });

  return result;
}

function* unregister(registrationId) {
  let existingRegistration = yield repository.findRegistration(registrationId);
  if (existingRegistration == undefined) {
    throw new OpenHouseEventRegistrationNotFoundError('registration does not exist');
  }
  existingRegistration.is_active = false;

  const result = yield repository.updateRegistration(existingRegistration);

  sendNotification('OHE_UNREGISTERED', {
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
