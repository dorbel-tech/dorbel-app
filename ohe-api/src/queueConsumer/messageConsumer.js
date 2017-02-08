'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const userManagement = shared.utils.userManagement;
const oheEventService = require('../services/openHouseEventsService');
const oheEventsFinderService = require('../services/openHouseEventsFinderService');
const oheRegisterSercice = require('../services/openHouseEventRegistrationsService');
const co = require('co');

// Creating special notification service dummy user to handle data retrival from service in order to pass user validation checks.
const oheServiceUser = { id: '20000000-0000-0000-0000-000000000000', role: 'admin' };

function handleMessage(message) {
  logger.debug('handleMessage', message);

  return co(function *() {
    switch (message.eventType) {
      case 'APARTMENT_UNLISTED':
      case 'APARTMENT_RENTED':
        // Cancel all active OHEs.
        yield cancleOHEs(message.dataPayload.listing_id);
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

function* cancleOHEs(listingId) {
  const events = yield oheEventService.findByListing(listingId, oheServiceUser);

  for (let i=0; i< events.length; i++) {
    yield oheEventService.remove(events[i].id, oheServiceUser);
  }
}

function* unregisterUsers(eventId) {
  const event = yield oheEventsFinderService.find(eventId);

  if (event.registrations) {
    for (let i=0; i< event.registrations.length; i++) {
      let userId = event.registrations[i].registered_user_id;
      const publishingUser = yield userManagement.getUserDetails(userId);
      const user = { id: userId, role: publishingUser.role };
      yield oheRegisterSercice.unregister(eventId, user);
    }
  }
}

module.exports = {
  handleMessage: messageBus.handleMessageWrapper.bind(null, handleMessage)  
};
