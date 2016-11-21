// Email dispatcher using Mandrill API
'use strict';
const shared = require('dorbel-shared');
const config = shared.config;
const logger = shared.logger.getLogger(module);
const mandrill = require('mandrill-api/mandrill');
const emailClient = new mandrill.Mandrill(config.get('MANDRILL_API_KEY'));

function send(templateName, additionalParams) {
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

  return new Promise((resolve, reject) => {
    emailClient.messages.sendTemplate({
      template_name: templateName,
      template_content: templateContent,
      message: messageParams,
      async: false,
      ip_pool: null,
      send_at: null
    }, resolve, reject);
  })
  .then(msg => {
    logger.info(msg, 'Email was sent');
    return msg;
  }).catch(err => {
    logger.error(err, 'Email sending error');
    throw err;
  }); 
}

module.exports = {
  send
};
