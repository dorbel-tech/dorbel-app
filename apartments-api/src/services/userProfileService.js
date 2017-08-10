'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.user.management;

const profileSectionParams = {
  main: {
    first_name: { isRequired: true },
    last_name: { isRequired: true },
    phone: { isRequired: true },
    email: { isRequired: true }
  },
  tenant_profile: {
    about_you: { isRequired: false },
    work_place: { isRequired: false },
    position: { isRequired: false },
    facebook_url: { isRequired: false },
    linkedin_url: { isRequired: false }
  },
  settings: {
    allow_publisher_messages: { isRequired: false },
    receive_like_related_notifications: { isRequired: false },
    receive_newsletter: { isRequired: false }
  }
};

function* update(user, profileData) {
  if (user) {
    validateRequest(profileData);

    logger.info({ user_uuid: user.id, userData: profileData }, 'Updating user details');
    const newUserProfile = yield userManagement.updateUserDetails(user.id, {
      user_metadata: (profileData.section == 'main') ? profileData.data : { [profileData.section]: profileData.data }
    });
    logger.info({ user_uuid: user.id, userData: newUserProfile }, 'Updated user details');

    return newUserProfile;
  }
  else {
    logger.error({ userData: profileData }, 'Not allowed to update user details');
    throw new errors.NotResourceOwnerError();
  }
}

function validateRequest(profileData) {
  if (!profileData.section) {
    throw new errors.DomainValidationError('SectionNotDefined', { profileData }, 'The update request was rejected because no section was defined');
  }
  if (!profileSectionParams[profileData.section]) {
    throw new errors.DomainValidationError('IllegalSection', { profileData }, 'The update request was rejected because the supplied section is illegal');
  }

  const fieldMap = profileSectionParams[profileData.section];
  const keysToUpdate = _.keys(profileData.data);
  const sectionFieldKeys = _.keys(fieldMap) || []; 
  
  keysToUpdate
    .forEach((key) => {
      if (sectionFieldKeys.indexOf(key) == -1) {
        throw new errors.DomainValidationError('FieldNotAllowed', { field: key }, 'The update request contains an illegal, not white listed field!');
      }
    });

  sectionFieldKeys
    .forEach((key) => {
      if (fieldMap[key].isRequired && (profileData.data[key] == '' || profileData.data[key] == undefined)) {
        throw new errors.DomainValidationError('RequiredFieldMissing', { field: key }, `The update request doesn't contain a value for the '${key}' required field`);
      }
    });
}

module.exports = {
  update
};
