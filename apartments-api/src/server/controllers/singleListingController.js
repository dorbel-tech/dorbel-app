'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');

function* get() {
  this.response.body = yield listingService.getById(this.params.listingQueryString, this.request.user);
}

function* patch(){
  logger.debug('Patching listing...');
  const listingId = this.params.listingId;
  // TODO : only good for updating listing status 
  const updatedData = this.request.body;  
  const listing = yield listingService.updateStatus(listingId, this.request.user, updatedData.status);
  logger.info({listing_id: listingId, status: updatedData.status}, 'Listing status updated');

  this.response.status = 200;
  this.response.body = listing;
}

module.exports = {
  get: get,
  patch: patch
};

