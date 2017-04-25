'use strict';
const listingUsersService = require('../../services/listingUsersService');

function* post() {
  const listingId = this.params.listingId;
  const userToCreate = this.request.body;

  this.response.body = yield listingUsersService.create(listingId, userToCreate, this.request.user);
  this.response.status = 201;
}

module.exports = {
  post
};
