'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');

function* find(eventId) {
  return yield models.ohe.findOne({
    where: {
      id: eventId,
      is_active: true
    }
  });
}

function* findByListingId(listing_id) {
  return yield models.ohe.findAll({
    where: {
      listing_id: listing_id,
      is_active: true
    }
  });
}

function* create(openHouseEvent) {
  return yield db.models.ohe.create(openHouseEvent);
}

function* update(openHouseEvent) {
  let ohe = yield find(openHouseEvent.id);
  return yield ohe.update({
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
