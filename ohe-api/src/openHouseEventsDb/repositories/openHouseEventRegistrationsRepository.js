'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;

function findRegistration(oheId, userId) {
  return models.registration.findOne({
    where: {
      open_house_event_id: oheId,
      registered_user_id: userId,
      is_active: true
    }
  });
}

function createRegistration(eventRegistration) {
  return models.registration.create(eventRegistration);
}

function updateRegistration(eventRegistration) {
  return eventRegistration.update({
    is_active: eventRegistration.is_active
  });
}

module.exports = {
  findRegistration,
  createRegistration,
  updateRegistration
};
