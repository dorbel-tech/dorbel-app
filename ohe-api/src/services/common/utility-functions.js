'use strict';

var _ = require('lodash');
var moment = require('moment');
const shared = require('dorbel-shared');
const config = shared.config;
const errors = require('../domainErrors');
const userManagement = shared.utils.userManagement;

const CLOSE_EVENT_IF_TOO_CLOSE = config.get('CLOSE_EVENT_IF_TOO_CLOSE');

function calculateOHEStatus(oheModel, userId) { // userId is the registred userId, not the creator of the listing
  if (moment().isAfter(oheModel.start_time)) {
    return 'expired';
  } else if (userId && _.find(oheModel.registrations, { registered_user_id: userId, is_active: true })) {
    return 'registered';
  } else if (oheModel.registrations.length >= oheModel.max_attendies) {
    return 'full';
  } else if (oheModel.registrations.length === 0 && moment().add(CLOSE_EVENT_IF_TOO_CLOSE, 'minutes').isAfter(oheModel.start_time)) {
    return 'late';
  }

  return 'open';
}

function validateResourceOwnership(resourceOwnerId, user) {
  if (!user || (!userManagement.isUserAdmin(user) && resourceOwnerId != user.id)) {
    throw new errors.NotResourceOwnerError();
  }
}

module.exports = {
  calculateOHEStatus,
  validateResourceOwnership
};
