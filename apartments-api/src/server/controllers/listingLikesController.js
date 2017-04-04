'use strict';
const likeService = require('../../services/likeService');

function* get() {
  this.response.body = yield likeService.getListingLikesCount(this.params.listingId);
}

module.exports = {
  get
};
