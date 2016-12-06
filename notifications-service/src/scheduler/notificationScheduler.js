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
const eventCancelations = require('./eventCancelations.json');

const objectTypeToIdField = { // TODO: should these be a standard in the event structure ?
  open_house_event: 'event_id',
  apartment: 'apartment_id'
};

function handleMessage(payload) {
  logger.debug(payload, 'handeling app event');
  return cancelNotifications(payload)
  .then(() => setNotifications(payload));
}

function setNotifications(payload) {
  return Promise.all( 
    eventConfigurations
      .filter(eventConfig => eventConfig.eventType === payload.eventType)
      .filter(eventConfig => validateEvent(eventConfig, payload.dataPayload))
      .map(eventConfig => {
        return notificationRepository.create({
          notificationType: eventConfig.notificationType,
          scheduledTo: getScheduledTo(eventConfig, payload.dataPayload),          
          relatedObjectType: eventConfig.relatedObjectType,
          relatedObjectId: getRelatedObjectId(eventConfig, payload.dataPayload),
          user_uuid: payload.dataPayload.user_uuid    
        });
      })
  );
}

function cancelNotifications(payload) {
  return Promise.all( 
    eventCancelations
      .filter(cancelConfig => cancelConfig.eventType === payload.eventType)
      .filter(cancelConfig => validateEvent(cancelConfig, payload.dataPayload))
      .map(cancelConfig => {
        return notificationRepository.cancel({
          notificationTypes: cancelConfig.cancelNotificationTypes,
          relatedObjectType: cancelConfig.relatedObjectType,
          relatedObjectId: getRelatedObjectId(cancelConfig, payload.dataPayload),
        }); 
      })
  );
}

function validateEvent(eventConfig, eventPayload) {
  // if validation returns false, nothing will be done but message will be marked as completed
  //    so messages with bad payload will be removed from the queue
  // if message needs to be retired - validation should throw an error 

  if (!getRelatedObjectId(eventConfig, eventPayload)) {
    logger.error(eventPayload, 'event missing related Object Id');
    return false;
  }

  if (eventConfig.delayRelativeTo && !eventPayload[eventConfig.delayRelativeTo]) {
    logger.error(eventPayload , 'could not find delayRelativeTo field in event payload');
    return false;
  } 

  return true; 
}

function getRelatedObjectId(eventConfig, eventPayload) {
  return eventPayload[objectTypeToIdField[eventConfig.relatedObjectType]];
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
