'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
const _ = require('lodash');
const ONE_MINUTE = 60;

async function get(ctx) {
  const options = {
    user: ctx.request.user
  };

  if (ctx.request.query.limit) {
    options.limit = parseInt(ctx.request.query.limit) || undefined;
  }

  if (ctx.request.query.offset) {
    options.offset = parseInt(ctx.request.query.offset) || undefined;
  }

  shared.helpers.headers.setUserConditionalCacheHeader(ctx.request, ctx.response, ONE_MINUTE);

  let filter = {};
  const filterJSON = ctx.request.query.q;
  if (filterJSON) {
    // TODO: Switch to regex test instead of try-catch.
    try {
      filter = JSON.parse(filterJSON);
    } catch (e) {
      throw new shared.utils.domainErrors.DomainValidationError('Failed to parse filter JSON!');
    }
  }

  ctx.response.body = await listingService.getByFilter(filter, options);
}

async function post(ctx) {
  logger.debug('Creating new listing...');
  let newApartment = ctx.request.body;
  let createdListing = await listingService.create(newApartment, ctx.request.user);
  let logObject = _.pick(createdListing, ['id', 'publishing_user_id']);
  logger.info({
    listing_id: logObject.id,
    user_uuid: logObject.publishing_user_id
  }, 'New listing created');

  ctx.response.status = 201;
  ctx.response.body = createdListing;
}

module.exports = {
  post: post,
  get: get
};
