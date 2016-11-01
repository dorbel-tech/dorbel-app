'use strict';
const apartmentRepository = require('../../apartmentDb/repositories/apartmentRepository');

function* post() {
  let newApartment = this.request.body;
  // TODO : this does find-or-create - we should return an error if the apartment already exists
  let createdApartment = yield apartmentRepository.create(newApartment);
  this.response.status = 201;
  this.response.body = createdApartment;
}

module.exports = {
  post: post
};
