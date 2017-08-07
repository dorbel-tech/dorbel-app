'use strict';
const likeService = require('../../services/likeService');
const shared = require('dorbel-shared');

async function get(ctx) {
  shared.helpers.headers.setNoCacheHeader(ctx.response);
  ctx.response.body = await likeService.getUserLikes(ctx.request.user);
}

module.exports = {
  get
};
