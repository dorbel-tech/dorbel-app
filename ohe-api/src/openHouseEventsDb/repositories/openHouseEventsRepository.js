'use strict';
const _ = require('lodash');
const db = require('../dbConnectionProvider');
const models = db.models;

const findInclude = [
  { model: models.registration, required: false, where: { is_active: true } }
];

const defaultQuery = { status: { $ne: 'deleted' } }; // Any status but 'deleted'.

function mapQuery(originalQuery) {
  let mappedQuery = {};
  if (originalQuery.listing_id) {
    mappedQuery.listing_id = originalQuery.listing_id;
  }
  if (originalQuery.minDate) {
    mappedQuery.start_time = { $gt : originalQuery.minDate };
  }

  return mappedQuery;
}

function find(query) {
  return models.open_house_event.findAll({
    where: _.defaults(mapQuery(query), defaultQuery),
    include: findInclude,
    order: 'start_time'
  });
}

function findById(eventId) {
  return models.open_house_event.findOne({
    where: {
      id: eventId
    },
    include: findInclude
  });
}

function findByListingId(listing_id) {
  return find({ listing_id: listing_id });
}

function create(openHouseEvent) {
  return models.open_house_event.create(openHouseEvent);
}

function update(openHouseEvent) {
  return openHouseEvent.update({
    start_time: openHouseEvent.start_time,
    end_time: openHouseEvent.end_time,
    max_attendies: openHouseEvent.max_attendies,
    status: openHouseEvent.status
  });
}

module.exports = {
  find,
  findById,
  findByListingId,
  create,
  update
};
