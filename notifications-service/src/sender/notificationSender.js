/**
 * This module will handle messages coming from the events queue
 * Will get target user id's and send to segment
 */
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const recipientStrategy = require('./recipientStrategy');
const segmentClient = require('./segmentClient');

// TODO : move out of application code
const eventConfigurations = require('./eventConfigurations.json');

function handleMessage(payload) {
  logger.debug(payload, 'handeling app event');
  return Promise.all( 
    eventConfigurations
      .filter(eventConfig => eventConfig.eventType === payload.eventType)
      .map(eventConfig => sendEvent(eventConfig, payload.dataPayload))
  );
}

function sendEvent(eventConfig, eventData) {
  recipientStrategy.getRecipients(eventConfig, eventData)
  .then(recipients => {
    return Promise.all(
      recipients.map(recipient => segmentClient.track(recipient, eventConfig.notificationType, eventData))
    );
  });  
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
