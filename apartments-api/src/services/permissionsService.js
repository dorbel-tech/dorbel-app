'use strict';
const shared = require('dorbel-shared');
const userManagement = shared.utils.userManagement;

function isAdmin(user) {
  return userManagement.isUserAdmin(user);
}

function isPublishingUser(user, listing) {
  return listing.publishing_user_id === user.id;
}

function isPublishingUserOrAdmin(user, listing) {
  return isPublishingUser(user, listing) || isAdmin(user);
}

module.exports = {
  isAdmin,
  isPublishingUser,
  isPublishingUserOrAdmin
};
