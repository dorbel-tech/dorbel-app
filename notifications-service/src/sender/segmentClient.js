'use strict';
const Analytics = require('analytics-node');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

const key = shared.config.get('SEGMENT_IO_WRITE_KEY');
let analytics;

if (key) {
  analytics = new Analytics(key);
} else {
  logger.warn('Segment.io will not track as no key was supplied');
  analytics = { track: () => {} };
}

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
