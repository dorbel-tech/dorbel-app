// Apartment created notifications handler.
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const emailDispatcher = require('../../dispatchers/emailDispatcher');
const smsDispatcher = require('../../dispatchers/smsDispatcher');
const emailTemplates = require('../emailTemplates');

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

  try {
    // Pass dynamic params in email body using mergeVars object.
    const templateName = emailTemplates.templateSlug.APARTMENT_CREATED_1A;
    const fromName = (message.environemnt === 'production') ? 'dorbel' : 'dorbel ' + message.environemnt;
    const additionalParams = {
      from_name: fromName,
      email: message.dataPayload.user_email,
      first_name: message.dataPayload.user_first_name,
      last_name: message.dataPayload.user_last_name,
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

function sendSMS(messageBody) {
  logger.debug('Sending SMS');
  const message = JSON.parse(messageBody.Message);
  const envAttach = (message.environemnt === 'production') ? '' : '(' + message.environemnt + ')';

  try {
    const smsTemplate = _.template('New aprtment was added id: <%= apartment_id %> <%= environemnt %>');
    const smsText = smsTemplate({
      apartment_id: message.dataPayload.apartment_id,
      environemnt: envAttach
    });
    logger.debug({smsText}, 'SMS text');
    return smsDispatcher.send(message.dataPayload.user_phone, smsText);
  } catch (error) { throw error;  }

}

module.exports = {
  send
};
