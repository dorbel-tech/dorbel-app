'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');
const listingService = require('../../services/listingService');
const documentService = require('../../services/documentService');

// resolver signature is function(root-object, query-params, context, metadata) and should return value or promise
const resolvers = {
  Query: {
    cities: cityRepository.list,
    neighborhoods: (_, params) => neighborhoodRepository.getByCityId(params.city_id),
    listing: (_, params, context) => listingService.getById(params.listing_id, context.user),
    listings: (_, params, context) => listingService.getByFilter(params, { user: context.user })
  },
  Listing: {
    documents: (listing, params, context) => documentService.getByListingId(listing.id, context.user)
  }
};

module.exports = resolvers;
