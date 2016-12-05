'use strict';
// TODO: put this in a real DB !
const moment = require('moment');
const faker = require('faker');

let notifications = [];
let pollIntervalHandle;

function create(notification) {
  notification.id = faker.random.uuid();
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
