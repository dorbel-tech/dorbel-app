/**
 * This module will handle notifications that need to be sent
 */
'use strict';
const _ = require('lodash');
const dataRetrivel = require('./dataRetrivel');
// const sqsProducer = require('./sqsProducer');
const notifications = require('./notificationConfiguration.json');

function handleNotificationEvent(notificationEvent) {
  return Promise.all(
    notifications
    .filter(notification => notification.notificationType === notificationEvent.notificationType)
    .map(notificationConfig => sendNotification(notificationConfig, notificationEvent))
  );
}

function sendNotification(notificationConfig, notificationEvent) {
  return getDataForNotification(notificationConfig, notificationEvent)
  .then(eventParams => {    
    const notificationRequest = _.extend(notificationConfig, notificationEvent, eventParams);
    console.log('will send', notificationRequest);
    // return sqsProducer.send(notificationConfig.medium, notificationRequest);
  });  
}

function getDataForNotification(notificationConfig, notificationEvent) {
  notificationConfig.dataRetrivel = notificationConfig.dataRetrivel || [];
  return Promise.all(
    notificationConfig.dataRetrivel
    .filter(retrivelFunctionName => dataRetrivel[retrivelFunctionName])
    .map(retrivelFunctionName => dataRetrivel[retrivelFunctionName](notificationEvent))
  )
  .then(results => {
    return results.reduce((prev, current) => _.extend(prev, current), {}); // all results are returned as one object
  });
}

module.exports = {
  handleNotificationEvent
};
