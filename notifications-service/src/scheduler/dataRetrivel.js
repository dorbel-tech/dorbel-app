/**
 * This module provides data retrivel functions needed by the notification-sender
 * To fetch the different data needed by each notification type RIGHT BEFORE it is actually sent
 */
'use strict';
const shared = require('dorbel-shared');
const userManagement = shared.utils.userManagement;

function ohe_details(eventPayload) {
  // get ohe details ...
}

function getUserDetails(eventPayload) {
  return userManagement.getUserDetails(eventPayload.user_uuid)
    .then(response => ({ user: response[0] }));
}

module.exports = {
  ohe_details,
  getUserDetails
};
