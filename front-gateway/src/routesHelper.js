'use strict';

const APARTMENTS_PREFIX = '/apartments';
const DASHBOARD_PREFIX = '/dashboard';
const PROPERTY_PREFIX = '/properties';
const SEARCH_PREFIX = '/search';

function getListingPath(listing) {
  return APARTMENTS_PREFIX + '/' + (listing.slug || listing.id);
}

function getDashMyPropsPath(listing, addPath = '') {
  return DASHBOARD_PREFIX + '/my-properties/' + listing.id + addPath;
}

function getPropertyPath(listing) {
  return PROPERTY_PREFIX + '/' + listing.apartment_id;
}

module.exports = {
  APARTMENTS_PREFIX,
  DASHBOARD_PREFIX,
  PROPERTY_PREFIX,
  SEARCH_PREFIX,
  getListingPath,
  getDashMyPropsPath,
  getPropertyPath
};
