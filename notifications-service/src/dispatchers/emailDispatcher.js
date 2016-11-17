// Email dispatcher using Mandrill API
'use strict';
const shared = require('dorbel-shared');
const config = shared.config;
const path = require('path');
config.setConfigFileFolder(path.join(__dirname, '/../config')); // load config from file before anything else
const logger = shared.logger.getLogger(module);
var mandrill = require('mandrill-api/mandrill');

function send(templateName, additionalParams, done) {
  const emailClient = new mandrill.Mandrill(config.get('MANDRILL_API_KEY'));
  const templateContent = [{}];

  let messageParams = {
    to: [{
      email: additionalParams.userEmail,
      name: additionalParams.userFullName,
      type: 'to'
    }],
    merge_language: 'handlebars',
    global_merge_vars: additionalParams.mergeVars,
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

module.exports = {
  send
};
