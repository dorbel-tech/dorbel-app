// Apartment created notifications handler.
'use strict';
const shared = require('dorbel-shared');
const config = shared.config;
const path = require('path');
config.setConfigFileFolder(path.join(__dirname, '/../config')); // load config from file before anything else
const logger = shared.logger.getLogger(module);
var mandrill = require('mandrill-api/mandrill');
const twilio = require('twilio');

function sendEmail(messageBody, done) {
  // TODO: Get user email.
  logger.debug('Sending email');
  // const messageDataPayload = JSON.parse(messageBody.Message);

  const emailClient = new mandrill.Mandrill(config.get('MANDRILL_API_KEY'));
  const templateName = 'test';
  const templateContent = [{ }];

  // Pass dynamic params in email body using global_merge_vars object.
  let messageParams = {
    to: [{
      email: 'david@dorbel.com',
      name: 'Dorbel Tester',
      type: 'to'
    }],
    merge_language: 'handlebars',
    global_merge_vars: [
      {
        name: 'env',      
        content: process.env.NODE_ENV
      }
    ],
  };

  emailClient.messages.sendTemplate({
    template_name: templateName,
    template_content: templateContent,
    message: messageParams,
    async: false,
    ip_pool: null,
    send_at: null
  }, function (result) {
    logger.info('Email was sent', result);
    done();
  }, function (err) {
    logger.error('Email sending error', err);
    done(err);
  });
}

function sendSMS(messageBody, done) {
  // TODO: Get user phone number.
  logger.debug('Sending SMS');
  //const messageDataPayload = JSON.parse(messageBody.Message);
  const smsClient = new twilio.RestClient(config.get('TWILIO_ACCOUNT_SID'), config.get('TWILIO_AUTH_TOKEN'));

  smsClient.messages.create({
    body: 'Hello from notifications service on: ' + process.env.NODE_ENV,
    to: '+972544472571', // TODO: replace with real user phone number.
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
  sendEmail,
  sendSMS
};
