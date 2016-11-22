'use strict';
const listingService = require('../../services/listingService');

function* get(next) {
  this.response.body = yield listingService.getById(this.params.listingId);
}

module.exports = {
  get: get
};

