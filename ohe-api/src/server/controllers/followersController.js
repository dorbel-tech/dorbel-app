'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventFollowersService');

function* post() {
  const listingId = this.request.body.listing_id;
  const userId = this.request.user.id;
  logger.debug({ listing_id: listingId, following_user_id: userId }, 'Following an open house event...');
  let result = yield service.follow(listingId, userId);
  logger.info({ listing_id: listingId, following_user_id: userId, followId: result.id }, 'Follower created');
  this.response.status = 201;
  this.response.body = result;
}

function* remove() {
  const id = this.params.id;
  logger.debug({ followId: id }, 'Unfollow an open house event...');
  yield service.unfollow(this.params.id);
  logger.info(id, 'Unfollow completed');
  this.response.status = 200;
}

module.exports = {
  post: post,
  delete: remove
};
