'use strict';
const listingService = require('../../services/listingService');
const ONE_HOUR = 60 * 60;

function* get() {
  const listingId = parseInt(this.params.listingId);
  const NUMBER_OF_ITEMS = 3;
  const relatedListings = yield listingService.getRelatedListings(listingId, NUMBER_OF_ITEMS);
  
  if(relatedListings){
    this.response.set('Cache-Control', 'public, max-age=' + ONE_HOUR);
    this.response.body = relatedListings;
  }
}

module.exports = {
  get: get
};
