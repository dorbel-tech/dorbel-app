'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;
const _ = require('lodash');
const helper = require('./repositoryHelper');
const apartmentRepository = require('./apartmentRepository');
const buildingRepository = require('./buildingRepository');

function* get(eventId){
  yield models.open_house_event.findOne({
    where: {
      id: eventId
    }
  });
}

function* getByListingId(listing_id){
  yield models.open_house_event.findAll({
    where: {
      listing_id: listing_id
    }
  });
}

function* create(openHouseEvent) {
  yield db.models.open_house_event.create(openHouseEvent); 
}

function* update(openHouseEvent){
  yield db.models.open_house_event.update(openHouseEvent); 
}

module.exports = {
  get,
  create,
  update,
  getByListingId
};
