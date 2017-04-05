'use strict';
const userProfileService = require('../../services/userProfileService');


function* patch() {
  const dataToUpdate = this.request.body;
  const user = this.request.user;
  const newUserProfile = yield userProfileService.update(user, dataToUpdate);
  
  this.response.status = 200;
  this.response.body = newUserProfile;
}

module.exports = {
  patch
};
