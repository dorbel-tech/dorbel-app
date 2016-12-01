'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;

function* findRegistration(registrationId) {
  return yield models.registration.findOne({
    where: {
      id: registrationId,
      is_active: true
    }
  });
}

function* createRegistration(eventRegistration) {
  return yield models.registration.create(eventRegistration);
}

function* updateRegistration(eventRegistration) {
  return yield eventRegistration.update({
    is_active: eventRegistration.is_active
  });
}

module.exports = {
  findRegistration,
  createRegistration,
  updateRegistration
};
