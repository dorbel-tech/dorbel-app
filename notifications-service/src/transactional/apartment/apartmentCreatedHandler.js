// Apartment created notifications handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const emailDispatcher = require('../../dispatchers/emailDispatcher');
const smsDispatcher = require('../../dispatchers/smsDispatcher');
const userManagement = shared.utils.userManagement;
const emailTemplates = require('../emailTemplates');

function send(messageType, messageBody) {
  const message = JSON.parse(messageBody.Message);
  
  return userManagement.getUserDetails(message.dataPayload.user_uuid)
    .then(userDetails => {
      switch (messageType) {
        case 'Email':
          return sendEmail(messageBody, userDetails);
        case 'SMS':
          return sendSMS(messageBody, userDetails);

        default:
          throw new Error('Message type wasnt defined!');
      }
    });
}

function sendEmail(messageBody, userDetails) {
  logger.debug('Sending email');
  const message = JSON.parse(messageBody.Message);

  if (!userDetails[0].email) { throw new Error('No email was provided!'); }

  try {
    // Pass dynamic params in email body using mergeVars object.
    const templateName = emailTemplates.templateSlug.APARTMENT_CREATED_1A;
    const additionalParams = {
      email: userDetails[0].email,
      name: userDetails[0].name,
      mergeVars: [{
        name: 'environment',
        content: message.environemnt
      }, {
        name: 'apartment_id',
        content: message.dataPayload.apartment_id
      }]
    };
    logger.debug({additionalParams}, 'Email additionalParams');

    return emailDispatcher.send(templateName, additionalParams);    
  } catch (error) { throw error;  }
}

function sendSMS(messageBody, userDetails) {
  logger.debug('Sending SMS');
  const message = JSON.parse(messageBody.Message);

  if (!userDetails[0].phone) { throw new Error('No phone number was provided!'); }
  
  try {
    const smsTemplate = _.template('New aprtment was added id: <%= apartment_id %> (<%= environemnt %>)');
    const smsText = smsTemplate({
      apartment_id: message.dataPayload.apartment_id,
      environemnt: message.environemnt
    });
    logger.debug({smsText}, 'SMS text');
  } catch (error) { throw error;  }

  return smsDispatcher.send(userDetails[0].phone, smsText);
}

module.exports = {
  send
};
