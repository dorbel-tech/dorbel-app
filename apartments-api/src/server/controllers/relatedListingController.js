'use strict';
const listingService = require('../../services/listingService');
const shared = require('dorbel-shared');
const ONE_HOUR = 60 * 60;

function* get() {
  const listingId = parseInt(this.params.listingId);
  const NUMBER_OF_ITEMS = 3;
  const relatedListings = yield listingService.getRelatedListings(listingId, NUMBER_OF_ITEMS);
  
  if(relatedListings){
    shared.helpers.headers.setCacheHeader(this.response, ONE_HOUR);  
    this.response.body = relatedListings;
  }
}

module.exports = {
  get: get
};
