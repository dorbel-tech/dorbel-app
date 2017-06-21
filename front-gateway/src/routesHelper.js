'use strict';

function getPropertyPath(listing) {
  return '/properties/' + listing.apartment_id;
}

function getDashMyPropsPath(listing, addPath = '') {
  return '/dashboard/my-properties/' + listing.id + addPath;
}

module.exports = {
  getDashMyPropsPath,
  getPropertyPath
};
