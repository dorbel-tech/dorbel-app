'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const userManagement = shared.utils.userManagement;
const oheEventService = require('../services/openHouseEventsService');
const oheEventsFinderService = require('../service/openHouseEventsFinderService');
const oheRegisterSercice = require('../services/openHouseEventRegistrationsService');
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
      case 'OHE_DELETED':
        yield unregisterUsers(message.dataPayload.event_id);
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
  const events = yield oheEventService.findByListing(listingId, user);

  for (let i=0; i< events.length; i++) {
    yield oheEventService.remove(events[i].id, user);
  }
}

function* unregisterUsers(eventId) {
  const event = yield oheEventsFinderService.find(eventId);

  if (event.registrations) {
    for (let i=0; i< event.registrations.length; i++) {
      const publishingUser = yield userManagement.getUserDetails(event.registrations[i].user_uuid);
      const user = { id: event.registrations[i].user_uuid, role: publishingUser.role };
      yield oheRegisterSercice.unregister(eventId, user);
    }
  }
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)  
};
