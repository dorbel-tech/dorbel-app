// Apartment created notifications handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const emailDispatcher = require('../../dispatchers/emailDispatcher');
const smsDispatcher = require('../../dispatchers/smsDispatcher');

function sendEmail(messageBody, done) {
  logger.debug('Sending email');
  const message = JSON.parse(messageBody.Message);
  // Pass dynamic params in email body using mergeVars object.
  const templateName = 'test';
  const additionalParams = {
    userEmail: 'david@dorbel.com', // TODO: Get user email.
    userFullName: 'Dorbel Tester', // TODO: Get user full name.
    mergeVars: [
      {
        name: 'environment',
        value: message.environemnt
      },
      {
        name: 'apartment_id',
        value: message.dataPayload.apartment_id
      }
    ]
  };

  emailDispatcher.send(templateName, additionalParams, done);
}

function sendSMS(messageBody, done) {
  logger.debug('Sending SMS');
  const message = JSON.parse(messageBody.Message);
  const toPhoneNumber = '+972544472571'; // TODO: Get user phone number.
  const smsText = 'Hello from notifications service with aprtment id: ' + message.dataPayload.apartment_id + ' (' + message.environemnt + ')';

  smsDispatcher.send(toPhoneNumber, smsText, done);
}

module.exports = {
  sendEmail,
  sendSMS
};
