'use strict';
const documentService = require('../../services/documentService');

function * post() {
  const documentToCreate = this.request.body;
  documentToCreate.listing_id = this.params.listing_id;

  this.response.body = yield documentService.create(documentToCreate, this.request.user);
  this.response.status = 200;
}

function * get() {
  const listing_id = parseInt(this.params.listing_id);
  this.response.body = yield documentService.getByListingId(listing_id, this.request.user);
  this.response.status = 200;
}

module.exports = {
  get: get,
  post
};
