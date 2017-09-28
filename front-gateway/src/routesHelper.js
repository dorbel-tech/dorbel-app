'use strict';

const APARTMENTS_PREFIX = '/apartments';
const APARTMENTS_SUBMIT_PREFIX = '/apartments/submit';
const DASHBOARD_PREFIX = '/dashboard';
const SEARCH_PREFIX = '/search';

function getPropertyPath(listing) {
  return APARTMENTS_PREFIX + '/' + listing.id;
}

function getDashMyPropsPath(listing, addPath = '') {
  return DASHBOARD_PREFIX + '/my-properties/' + listing.id + addPath;
}

function getMyProfilePath(tab) {
  return DASHBOARD_PREFIX + '/my-profile/' + tab;
}

module.exports = {
  APARTMENTS_PREFIX,
  APARTMENTS_SUBMIT_PREFIX,
  DASHBOARD_PREFIX,
  SEARCH_PREFIX,
  getDashMyPropsPath,
  getMyProfilePath,
  getPropertyPath
};
