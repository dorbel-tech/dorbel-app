'use strict';
const db = require('../dbConnectionProvider');
const ListingUser = db.models.listingUser;

function create(user) {
  return ListingUser.create(user);
}

module.exports = {
  create
};
