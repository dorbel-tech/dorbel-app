'use strict';
import { renderToString } from 'react-dom/server';
import 'ignore-styles';
import shared from '~/app.shared';
import { config } from 'dorbel-shared';
import { getCloudinaryParams } from './server/cloudinaryConfigProvider';

function* renderApp() {
  const envVars = {
    NODE_ENV: config.get('NODE_ENV'),
    AUTH0_CLIENT_ID: config.get('AUTH0_CLIENT_ID'),
    AUTH0_DOMAIN: config.get('AUTH0_DOMAIN'),
    CLOUDINARY_PARAMS: getCloudinaryParams()
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
