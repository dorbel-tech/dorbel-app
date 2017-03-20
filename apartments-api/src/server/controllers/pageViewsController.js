'use strict';
const pageViewsService = require('../../services/pageViewsService');
const ONE_HOUR = 60 * 60;

function * get() {
  const listingIds = this.params.listingIds.split(',');
  this.response.set('Cache-Control', 'public, max-age=' + ONE_HOUR);
  this.response.body = yield pageViewsService.getPageViewsForListings(listingIds);
}

module.exports = {
  get: get
};
