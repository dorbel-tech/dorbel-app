'use strict';
//const shared = require('dorbel-shared');
//const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
//const _ = require('lodash');

function* get() {
  const listingId = parseInt(this.params.listingId);
  this.response.body = yield listingService.getRelated(listingId, 3);
}

module.exports = {
  get: get
};
