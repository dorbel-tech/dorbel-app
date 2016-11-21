// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('./apartment/apartmentCreatedHandler');

function handleMessage(message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  logger.debug('SQS Email message content', messageBody);

  switch (messageDataPayload.eventType) {
    case messageBus.eventType.APARTMENT_CREATED:
      apartmentCreatedHandler.sendEmail(messageBody, done);
      break;

    default:
      logger.info('Message was skipped and not processed as no handler was defined for its type.');
      done();
      break;
  }
}

module.exports = {
  handleMessage
};
