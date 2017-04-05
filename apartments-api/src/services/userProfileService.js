'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const _ = require('lodash');
const errors = shared.utils.domainErrors;
const userManagement = shared.utils.userManagement;

const whitelistedProfileParams = [
  'first_name',
  'last_name',
  'phone',
  'email'
];

function* update(user, dataToUpdate) {
  if (user) {
    throwErrorOnJunkParams(dataToUpdate);
    
    logger.info({ user_uuid: user.id, userData: dataToUpdate }, 'Updating user details');
    const newUserProfile = yield userManagement.updateUserDetails(user.id, {
      user_metadata: dataToUpdate
    });
    logger.info({ user_uuid: user.id, userData: newUserProfile }, 'Updated user details');

    return newUserProfile;
  }
  else {
    logger.error({ user_uuid: user.id, userData: dataToUpdate });
    throw new errors.NotResourceOwnerError();
  }
}

function throwErrorOnJunkParams(dataToUpdate) { // Allow only whitelisted fields
  const keysToUpdate = _.keys(dataToUpdate);
  keysToUpdate.forEach((key) => {
    if (whitelistedProfileParams.indexOf(key) == -1) {
      throw new errors.DomainValidationError('FieldNotAllowed', { field: key }, 'The update request contains an illegal, not white listed, field!');
    }
  });
}

module.exports = {
  update
};
