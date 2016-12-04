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
      logger.debug({userDetails}, 'User details from auth0');
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

  if (!userDetails.email) { throw new Error('No email was provided!'); }

  try {
    // Pass dynamic params in email body using mergeVars object.
    const templateName = emailTemplates.templateSlug.APARTMENT_CREATED_1A;
    const fromName = (message.environemnt === 'production') ? 'dorbel' : 'dorbel ' + message.environemnt;
    const additionalParams = {
      from_name: fromName,
      email: userDetails.email,
      name: userDetails.name,
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
  const envAttach = (message.environemnt === 'production') ? '' : '(' + message.environemnt + ')';

  if (!userDetails.user_metadata.phone) { throw new Error('No phone number was provided!'); }
  
  try {
    const smsTemplate = _.template('New aprtment was added id: <%= apartment_id %> <%= environemnt %>');
    const smsText = smsTemplate({
      apartment_id: message.dataPayload.apartment_id,
      environemnt: envAttach
    });
    logger.debug({smsText}, 'SMS text');
    return smsDispatcher.send(userDetails.user_metadata.phone, smsText);
  } catch (error) { throw error;  }

}

module.exports = {
  send
};
