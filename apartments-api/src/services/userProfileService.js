'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.userManagement;

const whitelistedProfileParams = {
  me: [
    'first_name',
    'last_name',
    'phone',
    'email'
  ],
  tenant: [
    'about_you',
    'work_place',
    'position',
    'facebook_url',
    'linkedin_url'
  ]
};

function* update(user, profileType, profileData) {
  if (user) {
    throwErrorOnJunkParams(profileData);

    logger.info({ user_uuid: user.id, userData: profileData }, 'Updating user details');
    const newUserProfile = yield userManagement.updateUserDetails(user.id, {
      user_metadata: (profileType == 'me') ? profileData : { [profileType]: profileData }
    });
    logger.info({ user_uuid: user.id, userData: newUserProfile }, 'Updated user details');

    return newUserProfile;
  }
  else {
    logger.error({ user_uuid: user.id, userData: profileData });
    throw new errors.NotResourceOwnerError();
  }
}

function throwErrorOnJunkParams(profileType, profileData) { // Allow only whitelisted fields
  const keysToUpdate = _.keys(profileData);
  keysToUpdate.forEach((key) => {
    if (whitelistedProfileParams.indexOf(key) == -1) {
      throw new errors.DomainValidationError('FieldNotAllowed', { field: key }, 'The update request contains an illegal, not white listed, field!');
    }
  });
}

module.exports = {
  update
};
