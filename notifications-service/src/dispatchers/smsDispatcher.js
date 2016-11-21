// SMS dispatcher using Twilio API
'use strict';
const shared = require('dorbel-shared');
const config = shared.config;
const logger = shared.logger.getLogger(module);
const twilio = require('twilio');
const smsClient = new twilio.RestClient(config.get('TWILIO_ACCOUNT_SID'), config.get('TWILIO_AUTH_TOKEN'));

function send(toPhoneNumber, smsText, done) {
  smsClient.messages.create({
    body: smsText,
    to: toPhoneNumber,
    from: config.get('TWILIO_PHONE_NUMBER') // From a valid Twilio number.
  }, function (err, message) {
    if (err) {
      logger.error(err, 'SMS sending error');
      done(err);
    } else {
      logger.info(message, 'SMS was sent');
      done();
    }
  });
}

module.exports = {
  send
};
