// Apartment created notifications handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const emailDispatcher = require('../dispatchers/emailDispatcher');
const smsDispatcher = require('../dispatchers/smsDispatcher');

function sendEmail(messageBody, done) {
  logger.debug('Sending email');
  // const messageDataPayload = JSON.parse(messageBody.Message);
  // TODO: Get user email.

  // Pass dynamic params in email body using mergeVars object.
  const templateName = 'test';
  const additionalParams = {
    userEmail: 'david@dorbel.com',
    userFullName: 'Dorbel Tester',
    mergeVars: [{
      name: 'env',
      value: process.env.NODE_ENV
    }]
  };

  emailDispatcher.send(templateName, additionalParams, done);
}

function sendSMS(messageBody, done) {
  logger.debug('Sending SMS');
  //const messageDataPayload = JSON.parse(messageBody.Message);
  // TODO: Get user phone number.
  const toPhoneNumber = '+972544472571';
  const smsText = 'Hello from notifications service on: ' + process.env.NODE_ENV;
  
  smsDispatcher.send(toPhoneNumber, smsText, done);
}

module.exports = {
  sendEmail,
  sendSMS
};
