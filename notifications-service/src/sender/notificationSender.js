/**
 * This module will handle messages coming from the events queue
 * Will get target user id's and send to segment
 */
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const dataRetrieval = require('./dataRetrieval');
const dataEnrichment = require('./dataEnrichment');
const analytics = shared.utils.analytics;
const messageBus = shared.utils.messageBus;

// TODO : move out of application code
const eventConfigurations = require('./eventConfigurations.json');

function handleMessage(payload) {
  logger.debug({ payload }, 'Handeling app event');
  return Promise.all(
    eventConfigurations
      .filter(eventConfig => eventConfig.eventType === payload.eventType)
      .map(eventConfig => sendEvent(eventConfig, payload.dataPayload))
  );
}

function sendEvent(eventConfig, eventData) {
  logger.debug({eventConfig, eventData}, 'Prepering event for sendig');
  return dataRetrieval.getAdditonalData(eventConfig, eventData)
    .then(additonalData => {
      return dataEnrichment.enrichAdditonalData(eventConfig, eventData, additonalData)
      .then(additonalEnrichedData => {
        let dataObject = Object.assign({}, additonalData, additonalEnrichedData); // Merge objects.
        const recipients = dataObject.customRecipients || [ eventData.user_uuid ];
        dataObject.website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
        const trackedEventData = Object.assign({}, eventData, dataObject);
        return Promise.all(
          recipients.map(recipient => {
            logger.info({ recipient, notificationType: eventConfig.notificationType }, 'Event sent to Segment');
            return analytics.track(recipient, eventConfig.notificationType, trackedEventData);
          })
        );
      });
    });
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)
};
