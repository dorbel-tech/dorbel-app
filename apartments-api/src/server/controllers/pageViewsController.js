'use strict';
const pageViewsService = require('../../services/pageViewsService');
const shared = require('dorbel-shared');
const ONE_HOUR = 60 * 60;

function * get() {
  const listingIds = this.params.listingIds.split(',');
  shared.helpers.headers.setCacheHeader(this.response, ONE_HOUR);  
  this.response.body = yield pageViewsService.getPageViewsForListings(listingIds);
}

module.exports = {
  get: get
};
