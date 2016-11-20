'use strict';
const listingService = require('../../services/listingService');

function* get() {
  this.response.body = yield listingService.list();
}

function* post() {
  let newApartment = this.request.body;
  newApartment.publishing_user_id = this.request.user.id;
  // TODO : this does find-or-create - we should return an error if the apartment already exists
  let createdApartment = yield listingService.create(newApartment);
  this.response.status = 201;
  this.response.body = createdApartment;
}

module.exports = {
  post: post,
  get: get
};
