'use strict';
const listingService = require('../../services/listingService');

function* post() {
  let apartment = this.request.body.apartment;
  this.response.body = yield listingService.getValidationData(apartment, this.request.user);
}

module.exports = {
  post
};
