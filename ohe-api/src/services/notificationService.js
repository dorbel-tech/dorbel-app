'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;

function send(messageType, data) {
  const topic = process.env.NOTIFICATIONS_SNS_TOPIC_ARN;
  if (!topic) {
    logger.debug(data, 'notification not sent for %s - topic is undefined', messageType);
    return;
  }
  messageBus.publish(topic, messageType, data);
}

module.exports ={
  send,
  eventType: messageBus.eventType
};
