// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const _ = require('lodash'); 
const dataRetrieval = require('./dataRetrieval');
const logger = shared.logger.getLogger(module);

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

    dataRetrieval.getDataForNotification(messageBody)
    .then(data => _.extend(messageBody, data))
    .then(message => dispatcher.send(message))
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
