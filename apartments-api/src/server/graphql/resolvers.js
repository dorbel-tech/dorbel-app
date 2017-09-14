'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const listingService = require('../../services/listingService');
const documentService = require('../../services/documentService');
const filterService = require('../../services/filterService');

// resolver signature is function(root-object, query-params, context, metadata) and should return value or promise
const resolvers = {
  Query: {
    cities: cityRepository.list,
    listing: (_, params, context) => listingService.getById(params.listing_id, context.user),
    listings: (_, params, context) => listingService.getByFilter(params, { user: context.user }),
    filters: (_, params, context) => filterService.getByUser(context.user)
  },
  Mutation: {
    upsertFilter: (_, params, context) => filterService.upsert(params.filter, context.user),
    deleteFilter: (_, params, context) => filterService.destory(params.id, context.user),
    toggleFiltersEmail: (_, params, context) => filterService.toggleEmail(params.email_notification, context.user)
  },
  Listing: {
    documents: (listing, params, context) => documentService.getByListingId(listing.id, context.user)
  }
};

module.exports = resolvers;
