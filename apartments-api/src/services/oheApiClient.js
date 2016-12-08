'use strict';
const util = require('util');
const request = require('request-promise');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const config = shared.config;

function generateRequestOptions(resource, method, userProfile) {
  if (!config.get('OHE_API_URL')) {
    throw new Error('Environment variable OHE_API_URL is required, but wasnt defined!');
  }

  return {
    method: method,
    url: util.format('%s/v1/%s', config.get('OHE_API_URL'), resource),
    headers: { 'x-user-profile': userProfile },
    json: true,
    resolveWithFullResponse: true
  };
}

function createOpenHouseEvent(userProfile, listingId, startTime, endTime, comments) {
  const options = generateRequestOptions('event', 'POST', userProfile);
  options.body = {
    start_time: startTime,
    end_time: endTime,
    comments: comments,
    listing_id: listingId
  };

  request(options).then(response => {
    logger.info({ event_id: response.body.id, listing_id: listingId }, 'new open house event created');
  }).catch(function (err) {
    logger.error({ error_code: err.statusCode, message: err.error, listing_id: listingId }, 'failed to create new open house event');
  });
}

module.exports = {
  createOpenHouseEvent
};
