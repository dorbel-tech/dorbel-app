/**
 * This module will handle messages coming from the events queue
 * Will get target user id's and send to segment
 */
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const dataRetrieval = require('./dataRetrieval');
const analytics = shared.utils.analytics;
const messageBus = shared.utils.messageBus;

// TODO : move out of application code
const eventConfigurations = require('./eventConfigurations.json');

function handleMessage(payload) {
  logger.debug({ payload }, 'handeling app event');
  return Promise.all( 
    eventConfigurations
      .filter(eventConfig => eventConfig.eventType === payload.eventType)
      .map(eventConfig => sendEvent(eventConfig, payload.dataPayload))
  );
}

function sendEvent(eventConfig, eventData) {
  logger.debug({eventConfig, eventData}, 'sendEvent');
  return dataRetrieval.getAdditonalData(eventConfig, eventData)
  .then(additonalData => {
    logger.debug({eventConfig, eventData, additonalData}, 'Got additional data');
    const recipients = additonalData.customRecipients || [ eventData.user_uuid ];    
    const trackedEventData = Object.assign({}, eventData, additonalData);

    return Promise.all(
      recipients.map(recipient => { 
        logger.debug({ recipient, eventConfig, trackedEventData}, 'Tracking sent to Segment');
        return analytics.track(recipient, eventConfig.notificationType, trackedEventData);
      })
    );
  });  
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)  
};
