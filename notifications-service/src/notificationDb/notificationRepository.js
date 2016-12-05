'use strict';
const moment = require('moment');
// TODO: put this in a real DB !
let notifications = [];
let pollIntervalHandle;

function create(notification) {
  notifications.push(notification);
  return Promise.resolve(notification);
}

function startPolling(handler, interval) {
  pollIntervalHandle = setInterval(() => {
    notifications.filter(notification => {
      return notification.status === 'pending' && moment(notification.scheduledTo).isBefore(moment());
    })
    .forEach(notification => {
      notification.status = 'in-flight';
      handler(notification).then(() => notification.status = 'sent');
    });
  }, interval);
}

function stopPolling() {
  clearInterval(pollIntervalHandle);
}

module.exports = {
  create,
  startPolling,
  stopPolling
};
