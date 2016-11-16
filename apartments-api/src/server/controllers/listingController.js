'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const messageBus = shared.utils.messageBus;
const listingService = require('../../services/listingService');

function* get() {
  this.response.body = yield listingService.list();
}

function* post() {
  logger.debug('Creating listing...');
  let newApartment = this.request.body;
  newApartment.publishing_user_id = this.request.user.id;
  // TODO : this does find-or-create - we should return an error if the apartment already exists
  let createdListing = yield listingService.create(newApartment);
  logger.info('Listing created', createdListing.id, createdListing.apartment_id, createdListing.publishing_user_id);

  // Publish event trigger message to SNS for notifications dispatching.
  yield messageBus.publish(messageBus.eventType.APARTMENT_CREATED, { apartment_id: createdListing.apartment_id, user_uuid: createdListing.publishing_user_id });

  this.response.status = 201;
  this.response.body = createdListing;
}

module.exports = {
  post: post,
  get: get
};
