// SMS dispatcher using Twilio API
const shared = require('dorbel-shared');
const config = shared.config;
const path = require('path');
config.setConfigFileFolder(path.join(__dirname, '/../config')); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const twilio = require('twilio');

function send(toPhoneNumber, smsText, done) {
  const smsClient = new twilio.RestClient(config.get('TWILIO_ACCOUNT_SID'), config.get('TWILIO_AUTH_TOKEN'));

  smsClient.messages.create({
    body: smsText,
    to: toPhoneNumber,
    from: config.get('TWILIO_PHONE_NUMBER') // From a valid Twilio number.
  }, function (err, message) {
    if (err) {
      logger.error('SMS sending error', err.message);
      done(err);
    } else {
      logger.info('SMS was sent', message);
      done();
    }
  });
}

module.exports = {
  send
};
