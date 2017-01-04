'use strict';
const listingService = require('../../services/listingService');

function* get() {
  const listingId = parseInt(this.params.listingId);
  const NUMBER_OF_ITEMS = 3;
  const relatedListings = yield listingService.getRelatedListings(listingId, NUMBER_OF_ITEMS);
  
  if(relatedListings){
    this.response.body = relatedListings;
  } // Will return 404 if the listingId doesn't exist in the DB
}

module.exports = {
  get: get
};
