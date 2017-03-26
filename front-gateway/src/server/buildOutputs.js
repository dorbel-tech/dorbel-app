'use strict';

function setBuildFiles(jsBundle, cssBundle) {
  return function* (next) {
    this.state = this.state || {};
    Object.assign(this.state, { cssBundle, jsBundle });
    yield next;
  };
}

function getBuildOutputs(app) {
  // Used for development only
  const hotReloadPort = process.env.HOT_RELOAD_SERVER_PORT || 8888;
  if (hotReloadPort) {
    const buildHost = 'http://localhost:' + hotReloadPort;

    app.use(setBuildFiles(
      `${buildHost}/build/bundle.js`,
      `${buildHost}/build/bundle.css`
    ));

    app.use(require('koa-proxy')({
      host: buildHost,
      match: /^\/build\//,
    }));
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
