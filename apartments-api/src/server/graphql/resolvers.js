'use strict';
const co = require('co');
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');
const listingService = require('../../services/listingService');
const documentService = require('../../services/documentService');

// resolver signiture is function(root-object, query-params, context, metadata) : returns value or promise

module.exports = {
  Query: {
    cities: cityRepository.list,
    neighborhoods: (_, params) => neighborhoodRepository.getByCityId(params.city_id),
    listing: (_, params, context) => co(function * () {
      return yield listingService.getById(params.listing_id, context.user);
    }),
    listings: (_, params, context) => co(function * () {
      return yield listingService.getByFilter(params, { user: context.user });
    })
  },
  Listing: {
    documents: (listing, params, context) => co(function * () {
      return yield documentService.getByListingId(listing.id, context.user);
    })
  }
};
