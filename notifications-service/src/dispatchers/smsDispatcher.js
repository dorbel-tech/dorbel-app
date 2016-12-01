// SMS dispatcher using Twilio API
'use strict';
const shared = require('dorbel-shared');
const config = shared.config;
const logger = shared.logger.getLogger(module);
const twilio = require('twilio');
const promisify = require('es6-promisify');
const smsClient = new twilio.RestClient(config.get('TWILIO_ACCOUNT_SID'), config.get('TWILIO_AUTH_TOKEN'));
const sendSMS = promisify(smsClient.messages.create, smsClient.messages);

function send(toPhoneNumber, smsText) {
  return sendSMS({
    body: smsText,
    to: toPhoneNumber,
    from: config.get('TWILIO_PHONE_NUMBER') // From a valid Twilio number.
  }).then(response => {
    logger.info((response), 'SMS was sent');
    return response;
  }); 
}

module.exports = {
  send
};
