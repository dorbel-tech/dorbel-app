'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const listingService = require('../../services/listingService');
const _ = require('lodash');

function* get() {
  this.response.body = yield listingService.getByFilter(this.request.query.q, this.request.user);
}

function* post() {
  logger.debug('Creating listing...');
  let newApartment = this.request.body;
  newApartment.publishing_user_id = this.request.user.id;
  // TODO : this does find-or-create - we should return an error if the apartment already exists
  let createdListing = yield listingService.create(newApartment);
  let logObject = _.pick(createdListing, ['id', 'publishing_user_id']);
  logger.info({ 
    listing_ud: logObject.id,
    user_uuid: logObject.publishing_user_id
  }, 'Listing created');

  this.response.status = 201;
  this.response.body = createdListing;
}

module.exports = {
  post: post,
  get: get
};
