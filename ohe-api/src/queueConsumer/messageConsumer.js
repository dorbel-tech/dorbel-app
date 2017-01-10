'use strict';
const shared = require('dorbel-shared');
const messageBus = shared.utils.messageBus;
const logger = shared.logger.getLogger(module);
const oheService = require('../services/openHouseEventsService');
const co = require('co');

function handleMessage(message) {
  logger.debug('handleMessage', message);

  return co(function *() {
    switch (message.eventType) {
      case 'APARTMENT_UNLISTED':
      case 'APARTMENT_RENTED':
        // Cancel all active OHEs.
        yield cancleOHEs(message.dataPayload.listing_id, message.dataPayload.user_uuid);
        break;  
      default:
        logger.debug(message.eventType, 'Skipping message.');
        // In case that message requires no processing, skip it.        
        break;
    }  
  });
}

function* cancleOHEs(listingId, user_uuid) {
  const result = yield oheService.findByListing(listingId, user_uuid);
  for (let i=0; i< result.length; i++) {
    yield oheService.remove(result[i].id);
  }
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)  
};
