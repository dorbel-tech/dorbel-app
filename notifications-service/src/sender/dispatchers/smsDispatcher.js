// SMS dispatcher using Twilio API
'use strict';
const shared = require('dorbel-shared');
const config = shared.config;
const logger = shared.logger.getLogger(module);
const twilio = require('twilio');
const promisify = require('es6-promisify');
const _ = require('lodash');
const smsClient = new twilio.RestClient(config.get('TWILIO_ACCOUNT_SID'), config.get('TWILIO_AUTH_TOKEN'));
const sendSMS = promisify(smsClient.messages.create, smsClient.messages);
const smsTemplates = require('./smsTemplates.json');

function send(params) {
  logger.debug('Sending SMS');

  if (!params.user.user_metadata.phone) { throw new Error('No phone number was provided!'); }
  
  const smsTemplate = _.template(smsTemplates[params.templateName]);
  const smsText = smsTemplate(params);

  logger.debug({smsText}, 'SMS text');

  return sendSMS({
    body: smsText,
    to: params.user.user_metadata.phone,
    from: config.get('TWILIO_PHONE_NUMBER') // From a valid Twilio number.
  }).then(response => {
    logger.info((response), 'SMS was sent');
    return response;
  }); 
}

module.exports = {
  send
};
