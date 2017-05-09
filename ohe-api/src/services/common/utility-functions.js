'use strict';

var _ = require('lodash');
var moment = require('moment');

const CLOSE_EVENT_IF_TOO_CLOSE = process.env.CLOSE_EVENT_IF_TOO_CLOSE || 90;

function calculateOHEStatus(oheModel, userId) { // userId is the registred userId, not the creator of the listing
  if (oheModel.status === 'inactive') {
    return 'inactive';
  } else if (moment().isAfter(oheModel.start_time)) {
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

module.exports = {
  calculateOHEStatus
};
