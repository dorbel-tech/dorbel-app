'use strict';
var shared = require('dorbel-shared');

var Analytics = require('analytics-node');
var analytics = new Analytics(shared.config.get('SEGMENT_IO_WRITE_KEY'));

function track(userId, eventName, properties) {
  analytics.track({
    userId,
    event: eventName,
    properties
  });
}

module.exports = {
  track
};
