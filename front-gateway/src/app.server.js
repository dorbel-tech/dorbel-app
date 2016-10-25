'use strict';
import { renderToString } from 'react-dom/server';
import 'ignore-styles';
import shared from '~/app.shared';

function* renderApp() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
  };

  const entryPoint = shared.injectStores();
  entryPoint.router.dispatch('on', this.path);
  const initialState = entryPoint.appStore.toJson();
  const appHtml = renderToString(entryPoint.app);
  yield this.render('index', { appHtml, initialState, envVars });
}

module.exports = {
  renderApp
};
