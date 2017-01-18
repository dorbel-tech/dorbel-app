'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const userManagement = shared.utils.userManagement;
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
        // In case that message requires no processing, skip it.        
        break;
    }  
  });
}

function* cancleOHEs(listingId, user_uuid) {
  const publishingUser = yield userManagement.getUserDetails(user_uuid);
  const user = { id: user_uuid, role: publishingUser.role };
  const result = yield oheService.findByListing(listingId, user);
  for (let i=0; i< result.length; i++) {
    yield oheService.remove(result[i].id, user);
  }
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)  
};
