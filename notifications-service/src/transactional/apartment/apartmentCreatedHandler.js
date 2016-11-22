// Apartment created notifications handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const emailDispatcher = require('../../dispatchers/emailDispatcher');
const smsDispatcher = require('../../dispatchers/smsDispatcher');

function send(messageType, messageBody) {
  switch (messageType) {
    case 'Email':
      return sendEmail(messageBody);
    case 'SMS':
      return sendSMS(messageBody);

    default:
      throw new Error('Message type wasnt defined!');
  }
}

function sendEmail(messageBody) {
  logger.debug('Sending email');
  const message = JSON.parse(messageBody.Message);
  // Pass dynamic params in email body using mergeVars object.
  const templateName = 'test';
  const additionalParams = {
    userEmail: 'david@dorbel.com', // TODO: Get user email.
    userFullName: 'Dorbel Tester', // TODO: Get user full name.
    mergeVars: [{
      name: 'environment',
      content: message.environemnt
    }, {
      name: 'apartment_id',
      content: message.dataPayload.apartment_id
    }]
  };

  return emailDispatcher.send(templateName, additionalParams);
}

function sendSMS(messageBody) {
  logger.debug('Sending SMS');
  const message = JSON.parse(messageBody.Message);
  const toPhoneNumber = '+972544472571'; // TODO: Get user phone number.
  const smsTemplate = _.template('Hello from notifications service with aprtment id: <%= apartment_id %> (<%= environemnt %>)');
  const smsText = smsTemplate({
    apartment_id: message.dataPayload.apartment_id,
    environemnt: message.environemnt
  });

  return smsDispatcher.send(toPhoneNumber, smsText);
}

module.exports = {
  send
};
