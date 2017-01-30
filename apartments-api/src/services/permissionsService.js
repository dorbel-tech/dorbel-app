'use strict';
const shared = require('dorbel-shared');
const userManagement = shared.utils.userManagement;

function isPublishingUser(user, listing) {
  return listing.publishing_user_id === user.id;
}

function isPublishingUserOrAdmin(user, listing) {
  return isPublishingUser(user, listing) || userManagement.userManagement.isUserAdmin(user);
}

module.exports = {
  isPublishingUser,
  isPublishingUserOrAdmin
};
