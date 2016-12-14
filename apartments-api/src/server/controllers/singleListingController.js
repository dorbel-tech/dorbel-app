'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');

function* get() {
  this.response.body = yield listingService.getById(this.params.listingId);
}

function* patch(){
  logger.debug('Patching listing...');
  const listingId = this.params.listingId;
  const updatedData = this.request.body;
  // const userId = this.request.user.id;
  const listing = yield listingService.updateStatus(listingId, updatedData.status);
  logger.info({listing_id: listingId, status: updatedData.status}, 'Listing status updated');

  this.response.status = 200;
  this.response.body = listing;
}

module.exports = {
  get: get,
  patch: patch
};

