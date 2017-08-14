'use strict';
const koaConvert = require('koa-convert'); // TODO: remove this after koa-proxy is converted to Koa2 (https://github.com/popomore/koa-proxy/issues/37)
const proxy = require('koa-proxy');

function setBuildFiles(jsBundle, cssBundle) {
  return async function (ctx, next) {
    ctx.state = ctx.state || {};
    Object.assign(ctx.state, { cssBundle, jsBundle });
    return next();
  };
}

function getBuildOutputs(app) {
  // Used for development only
  if (process.env.NODE_ENV === 'development') {
    const buildHost = 'http://localhost:' + 8888;

    app.use(setBuildFiles(
      `${buildHost}/build/bundle.js`,
      `${buildHost}/build/bundle.css`
    ));

    app.use(koaConvert(proxy({
      host: buildHost,
      match: /^\/build\//,
    })));
  } else {
    const buildManifest = require('../../public/build/manifest.json');

    app.use(setBuildFiles(
      `/build/${buildManifest['main.js']}`,
      `/build/${buildManifest['main.css']}`
    ));
  }
}

module.exports = {
  getBuildOutputs
};
