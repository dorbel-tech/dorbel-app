// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('./apartment/apartmentCreatedHandler');

// TODO : wrapper for message handler to include all the parsing and promising

function handleMessage(messageType, message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  let handler = null;
  logger.info({ messageBody, messageType }, 'SQS message content');

  switch (messageDataPayload.eventType) {
    case messageBus.eventType.APARTMENT_CREATED:
      handler = apartmentCreatedHandler;
      break;
  }
   
  if (handler) {
    handler.send(messageType, messageBody)
      .then(() => done())
      .catch(err => {
        logger.error(err, 'Notifications handler error');
        done(err);
      });
  } else {
    logger.info('Message was skipped and not processed as no handler was defined for its type.');      
    done();
  }
}

module.exports = {
  handleMessage
};
