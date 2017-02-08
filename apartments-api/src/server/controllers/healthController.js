'use strict';

function* get() {
  this.response.body = 'OK';
}

module.exports = {
  get: get
};
