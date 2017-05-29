'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');

function* get() {
  shared.helpers.headers.setNoCacheHeader(this.response);
  this.response.body = yield likeService.getUserLikes(this.request.user);
}

module.exports = {
  get
};
