'use strict';

const APARTMENTS_PREFIX = '/apartments';
const DASHBOARD_PREFIX = '/dashboard';

function getListingPath(listing) {
  return APARTMENTS_PREFIX + '/' + (listing.slug || listing.id);
}

function getDashMyPropsPath(listing, addPath = '') {
  return DASHBOARD_PREFIX + '/my-properties/' + listing.id + addPath;
}

module.exports = {
  APARTMENTS_PREFIX,
  DASHBOARD_PREFIX,
  getListingPath,
  getDashMyPropsPath
};
