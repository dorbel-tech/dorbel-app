'use strict';

async function get(ctx) {
  ctx.response.body = 'OK';
}

module.exports = {
  get: get
};
