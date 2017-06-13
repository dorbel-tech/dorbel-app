'use strict';
const filterService = require('../../services/filterService');

function * post() {
  const createdFilter = yield filterService.create(this.request.body, this.request.user);
  this.response.body = createdFilter;
  this.response.status = 200;
}

function * get() {
  this.response.body = yield filterService.getByUser(this.request.user);
  this.response.status = 200;
}

function * destory () {
  const filterId = parseInt(this.params.filterId);
  yield filterService.destory(filterId, this.request.user);
  this.response.status = 204;
}

function * put () {
  const filterId = parseInt(this.params.filterId);
  this.response.body = yield filterService.update(filterId, this.request.body, this.request.user);
  this.response.status = 200;
}

module.exports = {
  get: get,
  delete: destory,
  post,
  put
};
