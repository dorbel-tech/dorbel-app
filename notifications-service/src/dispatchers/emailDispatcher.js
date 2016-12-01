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
      email: additionalParams.email,
      name: additionalParams.name,
      type: 'to'
    }],
    merge_language: 'handlebars',
    global_merge_vars: additionalParams.mergeVars,
  };

  return new Promise((resolve, reject) => {
    return emailClient.messages.sendTemplate({
      template_name: templateName,
      template_content: templateContent,
      message: messageParams,
      async: false,
      ip_pool: null,
      send_at: null
    }, resolve, reject);
  })
  .then(response => {
    if (response[0].status != 'sent') {
      throw new Error('Email wasnt sent. Reason: ' + JSON.stringify(response));
    }

    logger.info(response, 'Email was sent');
    return response;
  });
}

module.exports = {
  send
};
