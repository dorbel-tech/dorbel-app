'use strict';

const strategies = {
  default: eventData => Promise.resolve([ eventData.user_uuid ])
};

function getRecipients(eventConfig, eventData) {
  const strategy = strategies[eventConfig.recipients] || strategies.default;

  return strategy(eventData);
}

module.exports = {
  getRecipients
};
