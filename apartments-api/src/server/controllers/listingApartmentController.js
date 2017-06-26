'use strict';
const shared = require('dorbel-shared');
const listingService = require('../../services/listingService');
const ONE_MINUTE = 60;

function* get() {
  const apartmentId = this.params.apartmentId;
  shared.helpers.headers.setUserConditionalCacheHeader(this.request, this.response, ONE_MINUTE);

  this.response.body = yield listingService.getByApartmentId(apartmentId, this.request.user);
}

module.exports = {
  get: get,
};
