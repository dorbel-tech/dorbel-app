'use strict';
const shared = require('dorbel-shared');
const messageBus = shared.utils.messageBus;
const logger = shared.logger.getLogger(module);
const oheService = require('../services/openHouseEventsService');

function handleMessage(message, done) {
  logger.debug('handleMessage', message);

  switch (message.eventType) {
    case 'APARTMENT_UNLISTED':
    case 'APARTMENT_RENTED':
      // Cancel all active OHEs.
      logger.debug('YEY!!!', message.dataPayload.listing_id, message.dataPayload.user_uuid);
      cancleOHEs(message.dataPayload.listing_id, message.dataPayload.user_uuid, done);
      break;  
    default:
      // In case that message requires no processing, skip it.
      done();
      break;
  }  
}

function* cancleOHEs(listingId, user_uuid, done) {
  logger.debug('cancleOHEs', listingId, user_uuid);
  const result = yield oheService.findByListing(listingId, user_uuid);
  logger.debug('listing events', result);

  result.forEach(event => {
    oheService.remove(event.id);
  }); 
  done();
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)  
};
