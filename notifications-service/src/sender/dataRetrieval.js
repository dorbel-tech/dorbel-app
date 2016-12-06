/**
 * This module provides data retrivel functions needed by the notification-sender
 * To fetch the different data needed by each notification type RIGHT BEFORE it is actually sent
 */
'use strict';
const _ = require('lodash');
const shared = require('dorbel-shared');
const userManagement = shared.utils.userManagement;

const dataRetrievalFunctions = {
  // ohe_details: function(eventPayload) {
  //   // get ohe details ...
  // },
  getUserDetails: function(eventPayload) {
    return userManagement.getUserDetails(eventPayload.user_uuid)
      .then(response => ({ user: response[0] }));
  }
};

function getDataForNotification(notificationEvent) {
  notificationEvent.dataRetrieval = notificationEvent.dataRetrieval || [];
  return Promise.all(
    notificationEvent.dataRetrieval // config contains array of function names
    .filter(retrivelFunctionName => dataRetrievalFunctions[retrivelFunctionName]) // only take ones that actually exist
    .map(retrivelFunctionName => dataRetrievalFunctions[retrivelFunctionName](notificationEvent)) // run the functions
  )
  .then(results => {
    // all results are returned as one object, duplicate keys will be prioritizing according to the order in notificationConfig.dataRetrieval 
    return results.reduce((prev, current) => _.extend(prev, current), {});
  });
}

module.exports = {
  getDataForNotification
};
