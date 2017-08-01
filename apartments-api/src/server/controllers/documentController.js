'use strict';
const documentService = require('../../services/documentService');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

function * get() {
  if (this.request.query.listing_id) {
    const listing_id = parseInt(this.request.query.listing_id);
    this.response.body = yield documentService.getByListingId(listing_id, this.request.user);
  } else {
    logger.warn('deprecated endpoint used - get documents by user');
    this.response.body = yield documentService.getByUser(this.request.user);
  }
  this.response.status = 200;
}

function * destroy() {
  const document_id = parseInt(this.params.document_id);
  yield documentService.destroy(document_id, this.request.user);
  this.response.status = 204;
}

function * post() {
  this.response.body = yield documentService.create(this.request.body, this.request.user);
  this.response.status = 201;
}

module.exports = {
  get: get,
  post: post,
  delete: destroy
};
