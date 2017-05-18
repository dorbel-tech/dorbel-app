'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventFollowersService');
const ONE_HOUR = 60 * 60;

function* get() {
  const listingId = this.params.id;
  const publishing_user_id = this.request.query.publishing_user_id;

  logger.debug({ listing_id: listingId }, 'Getting followers by listing...');

  let result = yield service.getByListing(listingId, this.request.user, publishing_user_id);
  logger.info({ listing_id: listingId, followers_count: result.length }, 'Got followers by listing');

  this.response.status = 200;

  shared.helpers.headers.setUserConditionalCacheHeader(this.request, this.response, ONE_HOUR);
  this.response.body = result;
}

function* post() {
  const listingId = this.request.body.listing_id;
  let user = this.request.body.user_details;
  user.user_id = this.request.user.id;
  logger.debug({ listing_id: listingId, user_uuid: user.user_id }, 'Following a listing...');

  const result = yield service.follow(listingId, user);
  logger.info({ listing_id: listingId, user_uuid: user.user_id, follow_id: result.id }, 'Follower created');
  this.response.status = 201;
  this.response.body = result;
}

function* remove() {
  const id = this.params.id;
  logger.debug({ followId: id }, 'Unfollow a listing...');
  yield service.unfollow(this.params.id, this.request.user);
  logger.info(id, 'Unfollow completed');
  this.response.status = 200;
}

module.exports = {
  get: get,
  post: post,
  delete: remove
};
