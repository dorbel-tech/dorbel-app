'use strict';
const listingService = require('../../services/listingService');

function* get() {
  this.response.body = yield listingService.getById(this.params.listingId);
}

module.exports = {
  get: get
};

