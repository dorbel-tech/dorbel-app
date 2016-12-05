'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const service = require('../../services/openHouseEventFollowersService');

function* post() {
  logger.debug('Following an open house event...');
  let result = yield service.follow(this.request.body.open_house_event_id, this.request.user.id);
  logger.info('Follower created');
  this.response.status = 201;
  this.response.body = result;
}

function* remove() {
  logger.debug('Unfollow an open house event...');
  let result = yield service.unfollow(this.params.id);
  logger.info(result.id, 'Unfollow completed');
  this.response.status = 200;
}

module.exports = {
  post: post,
  delete:remove
};
