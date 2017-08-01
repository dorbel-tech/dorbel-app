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
    listing: function * (_, params, context) {
      return yield listingService.getById(params.listing_id, context.user);
    },
    listings: function * (_, params, context) {
      return yield listingService.getByFilter(params, { user: context.user });
    }
  },
  Listing: {
    documents: function * (listing, params, context) {
      return yield documentService.getByListingId(listing.id, context.user);
    }
  }
};

module.exports = applyCoToGeneratorResolvers(resolvers);
