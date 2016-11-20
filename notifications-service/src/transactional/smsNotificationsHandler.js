// SMS notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('./apartment/apartmentCreatedHandler');

function handleMessage(message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  logger.debug('SQS SMS message content', messageBody);

  switch (messageDataPayload.eventType) {
    case messageBus.eventType.APARTMENT_CREATED:
      apartmentCreatedHandler.sendSMS(messageBody, done);
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
