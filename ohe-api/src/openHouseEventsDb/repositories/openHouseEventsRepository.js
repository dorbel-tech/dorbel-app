'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');

function* find(eventId) {
  return yield models.open_house_event.findOne({
    where: {
      id: eventId,
      is_active: true
    },
    include: [{ model: models.registration, required: false,  where: { is_active: true } }]
  });
}

function* findByListingId(listing_id) {
  return yield models.open_house_event.findAll({
    where: {
      listing_id: listing_id,
      is_active: true
    }
  });
}

function* create(openHouseEvent) {
  return yield db.models.open_house_event.create(openHouseEvent);
}

function* update(openHouseEvent) {
  return yield openHouseEvent.update({
    start_time: openHouseEvent.start_time,
    end_time: openHouseEvent.end_time,
    is_active: openHouseEvent.is_active
  });
}

function* findRegistration(registrationId) {
  return yield models.registration.findOne({
    where: {
      id: registrationId,
      is_active: true
    }
  });
}

function* createRegistration(eventRegistration) {
  return yield db.models.registration.create(eventRegistration);
}

function* updateRegistration(eventRegistration) {
  return yield eventRegistration.update({
    is_active: eventRegistration.is_active
  });
}

module.exports = {
  find,
  findByListingId,
  create,
  update,
  findRegistration,
  createRegistration,
  updateRegistration
};
