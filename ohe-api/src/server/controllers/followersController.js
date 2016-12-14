'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventFollowersService');

function* get() {
  const listingId = this.params.id;
  logger.debug({ listing_id: listingId }, 'Getting followers by listing...');
  let result = yield service.getByListing(listingId);
  logger.info({ listing_id: listingId, followers_count: result.length }, 'Got followers by listing');
  this.response.status = 200;
  this.response.body = result;
}

function* post() {
  const listingId = this.request.body.listing_id;
  const userId = this.request.user.id;
  logger.debug({ listing_id: listingId, following_user_id: userId }, 'Following a listing...');
  let result = yield service.follow(listingId, userId);
  logger.info({ listing_id: listingId, following_user_id: userId, followId: result.id }, 'Follower created');
  this.response.status = 201;
  this.response.body = result;
}

function* remove() {
  const id = this.params.id;
  logger.debug({ followId: id }, 'Unfollow a listingt...');
  yield service.unfollow(this.params.id);
  logger.info(id, 'Unfollow completed');
  this.response.status = 200;
}

module.exports = {
  get: get,
  post: post,
  delete: remove
};
