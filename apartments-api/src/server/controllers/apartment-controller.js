'use strict';
let apartments = [];

function* get() {
  this.response.body = apartments;
}

function* post() {
  let newApartment = this.request.body;
  apartments.push(newApartment);
  this.response.status = 201;
  this.response.body = newApartment;
}

module.exports = {
  get: get,
  post: post
};
