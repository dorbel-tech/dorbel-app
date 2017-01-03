'use strict';
//const shared = require('dorbel-shared');
//const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
//const _ = require('lodash');

function* get() {
  const listingId = parseInt(this.params.listingId);
  const listing = yield listingService.getById(listingId);

  // Verify that the listing exists
  if (listing) {
    const numOfItems = 3;
    const listingQuery = {
      status: 'listed',
      $not: {
        id: listingId
      }
    };

    const options = {
      buildingQuery: {
        city_id: listing.apartment.building.city_id
      },
      limit: numOfItems,
      order: 'created_at DESC'
    };

    this.response.body = yield listingService.list(listingQuery, options);
  }
}

module.exports = {
  get: get
};
