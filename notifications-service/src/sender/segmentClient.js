'use strict';
var Analytics = require('analytics-node');
var shared = require('dorbel-shared');
var logger = shared.logger.getLogger(module);
var analytics = new Analytics(shared.config.get('SEGMENT_IO_WRITE_KEY'));

function track(userId, eventName, properties) {
  logger.debug({userId, eventName, properties}, 'tracking event to segment io');
  analytics.track({
    userId,
    event: eventName,
    properties
  });
}

module.exports = {
  track
};
