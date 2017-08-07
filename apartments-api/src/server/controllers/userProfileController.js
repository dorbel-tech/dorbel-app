'use strict';
const userProfileService = require('../../services/userProfileService');

async function patch(ctx) {
  const user = ctx.request.user;
  const profileData = ctx.request.body;

  const newUserProfile = await userProfileService.update(user, profileData);

  ctx.response.status = 200;
  ctx.response.body = newUserProfile;
}

module.exports = {
  patch
};
