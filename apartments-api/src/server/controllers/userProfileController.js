'use strict';
const _ = require('lodash');

const userProfileService = require('../../services/userProfileService');


function* patch() {
  const user = this.request.user;
  const profileType = _.last(this.path.split('/'));
  const profileData = this.request.body;

  const newUserProfile = yield userProfileService.update(user, profileType, profileData);

  this.response.status = 200;
  this.response.body = newUserProfile;
}

module.exports = {
  patch
};
