'use strict';
const pageViewsService = require('../../services/pageViewsService');

function * get() {
  const listingIds = this.params.listingIds.split(',');
  this.response.body = yield pageViewsService.getPageViewsForListings(listingIds);
}

module.exports = {
  get: get
};
