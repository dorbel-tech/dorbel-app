/**
 * This module will handle messages coming from the events queue
 * Will schedule notifications based on the incoming events and the events-configuration
 */
'use strict';
const moment = require('moment');
const shared = require('dorbel-shared');

const logger = shared.logger.getLogger(module);

const notificationRepository = require('../notificationDb/notificationRepository');
const eventConfigurations = require('./eventConfigurations.json');

const objectTypeToIdField = { // TODO: should these be a standard in the event structure ?
  open_house_event: 'event_id',
  apartment: 'apartment_id'
};

function handleMessage(payload) {
  logger.debug(payload, 'handeling app event');

  return Promise.all( 
    eventConfigurations
      .filter(eventConfig => eventConfig.eventType === payload.eventType)
      .filter(eventConfig => validateEvent(eventConfig, payload.dataPayload))
      .map(eventConfig => setNotification(eventConfig, payload.dataPayload))
  );
}

function validateEvent(eventConfig, eventPayload) {
  // if validation returns false, nothing will be done but message will be marked as completed
  //    so messages with bad payload will be removed from the queue
  // if message needs to be retired - validation will throw an error 

  if (eventConfig.delayRelativeTo && !eventPayload[eventConfig.delayRelativeTo]) {
    logger.error(eventPayload , 'could not find delayRelativeTo field in event payload');
    return false;
  } 

  return true; 
}

function setNotification(eventConfig, eventPayload) {
  const notification = {
    notificationType: eventConfig.notificationType,
    scheduledTo: getScheduledTo(eventConfig, eventPayload),
    status: 'pending',
    relatedObjectType: eventConfig.relatedObjectType,
    relatedObjectId: eventPayload[objectTypeToIdField[eventConfig.relatedObjectType]],
    user_uuid: eventPayload.user_uuid    
  }; 

  return notificationRepository.create(notification);
}

function getScheduledTo(eventConfig, eventPayload) {
  if (!eventConfig.delay) {  // no delay
    return moment().toDate();
  }
  else if (eventConfig.delay && !eventConfig.delayRelativeTo) { // relative to now
    return moment().add(eventConfig.delay, 'hours').toDate();
  }
  else {
    return moment(eventPayload[eventConfig.delayRelativeTo], moment.ISO_8601, true)
      .add(eventConfig.delay, 'hours').toDate();
  }
}

// TODO: this should go somewhere generic
function handleMessageWrapper(handleFunc, message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  
  handleFunc(messageDataPayload)
    .then(() => done())
    .catch(err => done(err));
}

module.exports = {
  handleMessage: handleMessageWrapper.bind(null, handleMessage)
};
