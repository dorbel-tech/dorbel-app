// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('./apartmentCreatedHandler');

function handleMessage(message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  logger.debug('Email message content', messageBody);

  switch (messageDataPayload.eventType) {
    case messageBus.eventType.APARTMENT_CREATED:
      apartmentCreatedHandler.sendEmail(messageBody, done);
      break;

    default:
      var error = new Error('Message type not found');
      logger.error(error);
      done(error);
      break;
  }
}

module.exports = {
  handleMessage
};
