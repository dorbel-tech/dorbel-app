'use strict';
const documentService = require('../../services/documentService');

function * get() {
  this.response.body = yield documentService.getByUser(this.request.user);
  this.response.status = 200;
}

function * destroy() {
  const document_id = parseInt(this.params.document_id);
  yield documentService.destory(document_id, this.request.user);
  this.response.status = 204;
}

module.exports = {
  get: get,
  delete: destroy
};
