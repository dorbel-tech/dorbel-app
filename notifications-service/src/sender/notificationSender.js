/**
 * This module will handle notifications that need to be sent
 */
'use strict';
const _ = require('lodash');
const sqsProducer = require('./sqsProducer');
const notifications = require('./notificationConfiguration.json');

// this is fired when the notification's time to be sent arrives
function handleNotificationEvent(notificationEvent) {
  return Promise.all(
    notifications
    .filter(notification => notification.notificationType === notificationEvent.notificationType)
    .map(notificationConfig => sendNotification(notificationConfig, notificationEvent))
  );
}

function sendNotification(notificationConfig, notificationEvent) {
  const notificationRequest = _.extend(notificationConfig, notificationEvent);
  return sqsProducer.send(notificationConfig.medium, {
    id: notificationEvent.id.toString(),
    body: JSON.stringify(notificationRequest)
  }); 
}

module.exports = {
  handleNotificationEvent
};
