// Notificatons dispatcher.
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const apartmentCreatedHandler = require('apartmentCreatedHandler');

function begin() {
  logger.info('Begin consuming messages from notifications SQS queue.');

  let consumer = messageBus.consume.start(function (message, done) {
    logger.debug('Message content', message);

    switch (message.Message.eventType) {
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
  });
  return consumer;
}

function end(consumer) {
  consumer.stop();
}

module.exports = {
  begin,
  end
};
