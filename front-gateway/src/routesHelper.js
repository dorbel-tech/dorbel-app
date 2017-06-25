'use strict';

const PROPERTIES_PREFIX = '/properties';
const DASHBOARD_PREFIX = '/dashboard';
const SEARCH_PREFIX = '/search';

function getPropertyPath(listing) {
  return PROPERTIES_PREFIX + '/' + listing.apartment_id;
}

function getDashMyPropsPath(listing, addPath = '') {
  return DASHBOARD_PREFIX + '/my-properties/' + listing.id + addPath;
}

module.exports = {
  PROPERTIES_PREFIX,
  DASHBOARD_PREFIX,
  SEARCH_PREFIX,
  getDashMyPropsPath,
  getPropertyPath
};
