'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');
const listingService = require('../../services/listingService');
const documentService = require('../../services/documentService');
const { applyCoToGeneratorResolvers } = require('./coResolvers');

// resolver signiture is function(root-object, query-params, context, metadata) : returns value or promise
const resolvers = {
  Query: {
    cities: cityRepository.list,
    neighborhoods: (_, params) => neighborhoodRepository.getByCityId(params.city_id),
    listing: (_, params, context) => listingService.getById(params.listing_id, context.user),
    listings: (_, params, context) => listingService.getByFilter(params, { user: context.user })
  },
  Listing: {
    documents: async function (listing, params, context) {
      return await documentService.getByListingId(listing.id, context.user);
    }
  }
};

module.exports = applyCoToGeneratorResolvers(resolvers);
