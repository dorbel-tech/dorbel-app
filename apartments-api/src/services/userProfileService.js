'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.user.management;

const rootProfileSections = ['main', 'full_profile'];

const profileSectionParams = {
  main: {
    first_name: { isRequired: true },
    last_name: { isRequired: true },
    phone: { isRequired: true },
    email: { isRequired: true }
  },
  tenant_profile: {
    about_you: { isRequired: true },
    work_place: { isRequired: true },
    position: { isRequired: true },
    facebook_url: { isRequired: false },
    linkedin_url: { isRequired: false }
  },
  settings: {
    allow_publisher_messages: { isRequired: false },
    receive_like_related_notifications: { isRequired: false },
    receive_newsletter: { isRequired: false }
  }
};

const requiredProfileFieldPathMap = [];
_.keys(profileSectionParams).map((sectionName) => {
  _.keys(profileSectionParams[sectionName]).map((sectionField) => {
    if (profileSectionParams[sectionName][sectionField].isRequired) {
      requiredProfileFieldPathMap.push(sectionName == 'main' ? sectionField : `${sectionName}.${sectionField}`);
    }
  });
});

async function update(user, profileData) {
  if (user) {
    validateRequest(profileData);

    logger.info({ user_uuid: user.id, userData: profileData }, 'Updating user details');
    const newUserProfile = await userManagement.updateUserDetails(user.id, {
      user_metadata: (rootProfileSections.indexOf(profileData.section) != -1) ? profileData.data : { [profileData.section]: profileData.data }
    });
    logger.info({ user_uuid: user.id, userData: newUserProfile }, 'Updated user details');

    return newUserProfile;
  }
  else {
    logger.error({ userData: profileData }, 'Not allowed to update user details');
    throw new errors.NotResourceOwnerError();
  }
}

async function getUsersProfiles(userIds, limit = 15) {
  const profilesArr = [];
  const profiles = await Promise.all(userIds.map((userId) => { return userManagement.getPublicProfile(userId); }));
  if (profiles.length > 0) {
    for (var i = profiles.length - 1; i >= 0 && profilesArr.length <= limit; i--) {
      if (_.every(requiredProfileFieldPathMap, (key) => { return _.has(profiles[i], key); })) {
        profilesArr.push(profiles[i]);
      }
    }
  }
  return profilesArr;
}

function validateRequest(profileData) {
  if (profileData.section == 'full_profile') { // Quick and dirty solution because profile structure will probably change 
    validateRequest({ section: 'main', data: _.omit(profileData.data, 'tenant_profile') });
    validateRequest({ section: 'tenant_profile', data: profileData.data.tenant_profile });
  }
  else {
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
}

module.exports = {
  update,
  getUsersProfiles
};
