'use strict';
const util = require('util');
const request = require('request-promise');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const config = shared.config;
const moment = require('moment');

function generateRequestOptions(resource, method, userProfile) {
  return {
    method: method,
    url: util.format('%s/v1/%s', config.get('OHE_API_URL'), resource),
    headers: { 'x-user-profile': userProfile },
    json: true,
    resolveWithFullResponse: true
  };
}

function createOpenHouseEvent(createdListing, listing) {
  const userProfile = JSON.stringify({ id: createdListing.publishing_user_id });
  const start = buildTimeString(listing.open_house_event_date, listing.open_house_event_start_time);
  const end = buildTimeString(listing.open_house_event_date, listing.open_house_event_end_time);

  const options = generateRequestOptions('event', 'POST', userProfile);
  options.body = {
    start_time: start,
    end_time: end,
    comments: listing.open_house_event_comments,
    listing_id: createdListing.id,
    publishing_user_id: createdListing.publishing_user_id
  };

  request(options).then(response => {
    logger.info({ event_id: response.body.id, options: options.body }, 'new open house event created');
  }).catch(function (err) {
    logger.error({ error_code: err.statusCode, message: err.error, options: options.body }, 'failed to create new open house event');
  });
}

function buildTimeString(eventDate, eventTime) {
  return moment(util.format('%sT%s', eventDate, eventTime)).toISOString();
}

module.exports = {
  createOpenHouseEvent
};
