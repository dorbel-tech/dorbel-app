'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
const _ = require('lodash');
const ONE_MINUTE = 60;

function* get() {
  const options = {
    user: this.request.user
  };

  if (this.request.query.limit) {
    options.limit = parseInt(this.request.query.limit) || undefined;
  }

  if (this.request.query.offset) {
    options.offset = parseInt(this.request.query.offset) || undefined;
  }

  shared.helpers.headers.setUserConditionalCacheHeader(this.request, this.response, ONE_MINUTE);

  let filter = {};
  const filterJSON = this.request.query.q;
  if (filterJSON) {
    // TODO: Switch to regex test instead of try-catch.
    try {
      filter = JSON.parse(filterJSON);
    } catch (e) {
      throw new shared.utils.domainErrors.DomainValidationError('Failed to parse filter JSON!');
    }
  }

  this.response.body = yield listingService.getByFilter(filter, options);
}

function* post() {
  logger.debug('Creating new listing...');
  let newApartment = this.request.body;
  let createdListing = yield listingService.create(newApartment, this.request.user);
  let logObject = _.pick(createdListing, ['id', 'publishing_user_id']);
  logger.info({
    listing_id: logObject.id,
    user_uuid: logObject.publishing_user_id
  }, 'New listing created');

  this.response.status = 201;
  this.response.body = createdListing;
}

module.exports = {
  post: post,
  get: get
};
