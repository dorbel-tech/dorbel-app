'use strict';
const listingUsersService = require('../../services/listingUsersService');

function * post() {
  const listingId = this.params.listingId;
  const userToCreate = this.request.body;

  this.response.body = yield listingUsersService.create(listingId, userToCreate, this.request.user);
  this.response.status = 201;
}

function * get() {
  const listingId = this.params.listingId;
  this.response.body = yield listingUsersService.get(listingId, this.request.user);
  this.response.status = 200;
}

function * remove() {
  const listingUserId = this.params.listingUserId;
  yield listingUsersService.remove(listingUserId, this.request.user);
  this.response.status = 204;
}

module.exports = {
  post,
  get: get,
  delete: remove
};
