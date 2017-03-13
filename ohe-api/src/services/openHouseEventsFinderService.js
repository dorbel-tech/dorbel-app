'use strict';
const shared = require('dorbel-shared');
const errors = shared.utils.domainErrors;
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');

// TODO : This whole service does nothing and should be erased

function* find(eventId) {
  const existingEvent = yield openHouseEventsRepository.findById(eventId);
  if (existingEvent == undefined) {
    throw new errors.DomainNotFoundError('OpenHouseEventNotFoundError',
      { event_id: eventId },
      'event does not exist');
  }

  return existingEvent;
}

module.exports = {
  find
};
