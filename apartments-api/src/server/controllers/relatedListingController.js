'use strict';
const listingService = require('../../services/listingService');
const shared = require('dorbel-shared');
const ONE_HOUR = 60 * 60;

async function get(ctx) {
  // Written as params.listingId because all params under the route /listings/{paramName} have to be the same name
  const apartmentId = parseInt(ctx.params.listingId);
  const NUMBER_OF_ITEMS = 3;
  const relatedListings = await listingService.getRelatedListings(apartmentId, NUMBER_OF_ITEMS);

  if (relatedListings){
    shared.helpers.headers.setCacheHeader(ctx.response, ONE_HOUR);
    ctx.response.body = relatedListings;
  }
}

module.exports = {
  get: get
};
