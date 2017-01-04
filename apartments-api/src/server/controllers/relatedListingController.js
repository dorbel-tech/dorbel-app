'use strict';
const listingService = require('../../services/listingService');

function* get() {
  const listingId = parseInt(this.params.listingId);
  const numOfItemsLimit = 3;
  const relatedListings = yield listingService.getRelatedListings(listingId, numOfItemsLimit);
  
  if(relatedListings){
    this.response.body = relatedListings;
  } // Will return 404 if the listingId doesn't exist in the DB
}

module.exports = {
  get: get
};
