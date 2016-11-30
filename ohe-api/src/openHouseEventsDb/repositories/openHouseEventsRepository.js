'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;

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
  return yield models.open_house_event.create(openHouseEvent);
}

function* update(openHouseEvent) {
  return yield openHouseEvent.update({
    start_time: openHouseEvent.start_time,
    end_time: openHouseEvent.end_time,
    is_active: openHouseEvent.is_active
  });
}

module.exports = {
  find,
  findByListingId,
  create,
  update
};
