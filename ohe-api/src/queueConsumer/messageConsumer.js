'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const oheEventService = require('../services/openHouseEventsService');
const co = require('co');

// Creating special notification service dummy user to handle data retrival from service in order to pass user validation checks.
const oheServiceUser = { id: '20000000-0000-0000-0000-000000000000', role: 'admin' };

function handleMessage(message) {
  logger.debug(message, 'handleMessage');

  return co(function *() {
    switch (message.eventType) {
      case 'APARTMENT_RENTED':
      case 'APARTMENT_UNLISTED':
        // Mark all active OHEs as inactive.
        yield deactivateOHEs(message.dataPayload.listing_id);
        break;
      default:
        // In case that message requires no processing, skip it.
        break;
    }
  });
}

function* deactivateOHEs(listingId) {
  const events = yield oheEventService.findByListing(listingId, oheServiceUser);

  for (let i=0; i < events.length; i++) {
    yield oheEventService.deactivate(events[i].id, oheServiceUser);
  }
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)
};
