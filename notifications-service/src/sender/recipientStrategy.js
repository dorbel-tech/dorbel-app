'use strict';

const strategies = {
  default: eventData => Promise.resolve([ eventData.user_uuid ]),
  'ohe-followers': eventData => {
    
  }
};

function getRecipients(eventConfig, eventData) {
  const strategy = strategies[eventConfig.recipients] || strategies.default;

  return strategy(eventData);
}

module.exports = {
  getRecipients
};
