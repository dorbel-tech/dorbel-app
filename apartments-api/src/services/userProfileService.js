'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.userManagement;

const whitelistedProfileParams = {
  main: [
    'first_name',
    'last_name',
    'phone',
    'email'
  ],
  tenant_profile: [
    'about_you',
    'work_place',
    'position',
    'facebook_url',
    'linkedin_url'
  ]
};

function* update(user, profileData) {
  if (user) {
    const profileSection = profileData.profile_section;
    delete profileData.profile_section;
    
    throwErrorOnJunkParams(profileSection, profileData);

    logger.info({ user_uuid: user.id, userData: profileData }, 'Updating user details');
    const newUserProfile = yield userManagement.updateUserDetails(user.id, {
      user_metadata: (profileSection == 'main') ? profileData : { [profileSection]: profileData }
    });
    logger.info({ user_uuid: user.id, userData: newUserProfile }, 'Updated user details');

    return newUserProfile;
  }
  else {
    logger.error({ user_uuid: user.id, userData: profileData });
    throw new errors.NotResourceOwnerError();
  }
}

function throwErrorOnJunkParams(profileSection, profileData) { // Allow only whitelisted fields
  const keysToUpdate = _.keys(profileData);
  const allowedKeys = whitelistedProfileParams[profileSection] || [];
  keysToUpdate.forEach((key) => {
    if (allowedKeys.indexOf(key) == -1) {
      throw new errors.DomainValidationError('FieldNotAllowed', { field: key }, 'The update request contains an illegal, not white listed, field!');
    }
  });
}

module.exports = {
  update
};
