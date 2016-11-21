// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('./apartment/apartmentCreatedHandler');

function* handleMessage(messageType, message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  logger.debug({ messageBody, messageType }, 'SQS message content');

  try {
    switch (messageDataPayload.eventType) {
      case messageBus.eventType.APARTMENT_CREATED:
        yield apartmentCreatedHandler.send(messageType, messageBody);
        break;
        
      default:
        logger.info('Message was skipped and not processed as no handler was defined for its type.');
        break;
    }
    done();
  } catch (error) {
    done(error);
  }
}

module.exports = {
  handleMessage
};
