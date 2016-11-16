// Notificatons dispatcher.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('./apartmentCreatedHandler');

function handleMessage(message, done) {
  let messageBody = JSON.parse(message.Body);
  let messageDataPayload = JSON.parse(messageBody.Message);
  logger.debug('Message content', messageBody);

  switch (messageDataPayload.eventType) {
    case messageBus.eventType.APARTMENT_CREATED:
      /* TODO: How do we handle email sending success, but SMS sending failure?
       *       Do we remove the message from queue or keep it? 
       *       Do we need separate queues for each type of dispatcher? */
      apartmentCreatedHandler.sendEmail(message, done);
      apartmentCreatedHandler.sendSMS(message, done);
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
