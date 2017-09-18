'use strict';
const userProfileService = require('../../services/userProfileService');

async function patchUserProfile(ctx) {
  const user = ctx.request.user;
  const profileData = ctx.request.body;

  const newUserProfile = await userProfileService.update(user, profileData);

  ctx.response.status = 200;
  ctx.response.body = newUserProfile;
}

async function getUsersProfiles(ctx){
  const userIds = ctx.request.query.uids.split(',');
  const publicProfiles = await userProfileService.getUsersProfiles(userIds);

  ctx.response.status = 200;
  ctx.response.body = publicProfiles;
}

module.exports = {
  // using specific name with operation ID because fleek2 doesn't do patch requests
  patchUserProfile,
  getUsersProfiles
};
