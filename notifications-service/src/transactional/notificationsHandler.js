// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

// TODO : wrapper for message handler to include all the parsing and promising
const dispatchers = {
  email: require('./dispatchers/emailDispatcher'),
  sms: require('./dispatchers/smsDispatcher')
};

function handleMessage(messageType, message, done) {
  const messageBody = JSON.parse(message.Body);
  logger.info({ messageBody, messageType }, 'SQS message content');

  let dispatcher = dispatchers[messageType];

  if (!dispatcher) {
    logger.warn('Message was skipped and not processed as no dispatcher was defined for its type.');      
    done();
  } else {
    dispatcher.send(messageBody)
    .then(() => done())
    .catch(err => {
      logger.error(err, 'Notifications handler error');
      done();
    });
  }
}

module.exports = {
  handleMessage
};
