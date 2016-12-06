// Email notificatons handler.
'use strict';
const shared = require('dorbel-shared');
const _ = require('lodash'); 
const dataRetrieval = require('./dataRetrieval');
const logger = shared.logger.getLogger(module);

const transports = {
  email: require('./dispatchers/emailDispatcher'),
  sms: require('./dispatchers/smsDispatcher')
};

function handleMessage(messageType, message, done) {
  const messageBody = JSON.parse(message.Body);
  logger.info({ messageBody, messageType }, 'SQS message content');

  let transport = transports[messageType];

  if (!transport) {
    logger.warn('Message was skipped and not processed as no transport was defined for its type.');      
    done();
  } else {

    dataRetrieval.getDataForNotification(messageBody)
    .then(data => _.extend(_.cloneDeep(messageBody), data))
    .then(message => transport.send(message))
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
