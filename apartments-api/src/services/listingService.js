'use strict';
const util = require('util');
const request = require('request-promise');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const config = shared.config;
const messageBus = shared.utils.messageBus;
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const moment = require('moment');
const geoService = require('./geoService');

function buildTimeString(eventDate, eventTime) {
  return moment(util.format('%sT%s', eventDate, eventTime)).toISOString();
}
// TODO : move this to dorbel-shared
function CustomError(code, message) {
  let error = new Error(message);
  error.status = code;
  return error;
}

function* create(listing) {
  const existingOpenListingForApartment = yield listingRepository.getListingsForApartment(listing.apartment, { status: { $notIn: ['closed', 'rented'] } });
  if (existingOpenListingForApartment && existingOpenListingForApartment.length) {
    throw new CustomError(409, 'apartment already has an active listing');
  }

  if (listing.lease_start && !listing.lease_end) {
    // Upload form sends only lease_start so we default lease_end to after one year 
    listing.lease_end = moment(listing.lease_start).add(1, 'years').format('YYYY-MM-DD');
  }

  let modifiedListing = yield geoService.setGeoLocation(listing);
  let createdListing = yield listingRepository.create(modifiedListing);

  const userProfile = JSON.stringify({ id: createdListing.publishing_user_id });
  const start = buildTimeString(listing.ohe_date, listing.ohe_start_time);
  const end = buildTimeString(listing.ohe_date, listing.ohe_end_time);
  const options = {
    method: 'POST',
    url: config.get('OHE_API_URL') + '/v1/event',
    headers: { 'x-user-profile': userProfile },
    body: {
      start_time: start,
      end_time: end,
      listing_id: createdListing.id
    },
    json: true,
    resolveWithFullResponse: true
  };

  yield request(options)
    .then(response => {
      logger.info({ event_id: response.body.id, listing_id: createdListing.id }, 'new open house event created');
    }).catch(function (err) {
      logger.error({ error_code: err.statusCode, message: err.error, listing_id: createdListing.id }, 'failed to create new open house event');
    });

  // Publish event trigger message to SNS for notifications dispatching.
  if (config.get('NOTIFICATIONS_SNS_TOPIC_ARN')) {
    messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, {
      user_uuid: createdListing.publishing_user_id,
      apartment_id: createdListing.apartment_id
    });
  }

  return createdListing;
}

module.exports = {
  create,
  list: listingRepository.list,
  getById: listingRepository.getById
};
