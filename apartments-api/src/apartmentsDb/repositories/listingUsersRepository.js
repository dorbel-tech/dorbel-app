'use strict';
const db = require('../dbConnectionProvider');
const ListingUser = db.models.listingUser;

function create(user) {
  return ListingUser.create(user);
}

function getUsersForListing(listing_id) {
  return ListingUser.findAll({
    where: { listing_id},
    raw: true // readonly get - no need for full sequlize instances)
  });
}

module.exports = {
  create,
  getUsersForListing
};
