'use strict';

const PROPERTIES_PREFIX = '/properties';
const PROPERTY_SUBMIT_PREFIX = '/properties/submit';
const DASHBOARD_PREFIX = '/dashboard';
const SEARCH_PREFIX = '/search';

function getPropertyPath(listing) {
  return PROPERTIES_PREFIX + '/' + listing.apartment_id;
}

function getDashMyPropsPath(listing, addPath = '') {
  return DASHBOARD_PREFIX + '/my-properties/' + listing.id + addPath;
}

function getMyProfilePath(tab) {
  return DASHBOARD_PREFIX + '/my-profile/' + tab;
}

module.exports = {
  PROPERTIES_PREFIX,
  PROPERTY_SUBMIT_PREFIX,
  DASHBOARD_PREFIX,
  SEARCH_PREFIX,
  getDashMyPropsPath,
  getMyProfilePath,
  getPropertyPath
};
