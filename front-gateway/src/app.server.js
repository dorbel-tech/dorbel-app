'use strict';
import { renderToString } from 'react-dom/server';
import 'ignore-styles';
import _ from 'lodash';
import shared from '~/app.shared';
import { config } from 'dorbel-shared';
import { getCloudinaryParams } from './server/cloudinaryConfigProvider';

function setRoute(router, path) {
  // this method is used to set the route in the server side and wait until it resolves
  return new Promise(resolve => router.dispatch('on', path, resolve));
}

function setRequestRenderState(context, appStore) {
  // these are used to render the inital response in the index.ejs
  context.state = context.state || {};
  context.state.segment = config.get('SEGMENT_IO_WRITE_KEY'); // segment key is not part of env vars but is used when rendering index.ejs
  context.state.meta = _.defaults(appStore.metaData, {
    title: 'dorbel - מערכת לניהול והשכרת דירות ללא תיווך',
    description: 'השכרת דירות ללא תיווך. כל הפרטים שחשוב לדעת על הדירות בכדי לחסוך ביקורים מיותרים. בחרו מועד והירשמו לביקור בדירות בלחיצת כפתור.',
    image: {
      url:'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/meta/homepage-middle-image.jpg',
      width: 1093,
      height: 320
    },
    url: process.env.FRONT_GATEWAY_URL + context.path
  });
}

function* renderApp() {
  // Redirecting from root to main website.
  if (config.get('NODE_ENV') === 'production' && this.path === '/') {
    this.status = 301;
    return this.redirect('https://www.dorbel.com');
  }

  // Old apartment submit form to new one redirect.
  if (this.path === '/apartments/new') {
    this.status = 301;
    return this.redirect('https://app.dorbel.com/apartments/new_form');
  }

  const envVars = {
    NODE_ENV: config.get('NODE_ENV'),
    AUTH0_FRONT_CLIENT_ID: config.get('AUTH0_FRONT_CLIENT_ID'),
    AUTH0_DOMAIN: config.get('AUTH0_DOMAIN'),
    CLOUDINARY_PARAMS: getCloudinaryParams(),
    GOOGLE_MAPS_API_KEY: config.get('GOOGLE_MAPS_API_KEY'),
    FRONT_GATEWAY_URL: config.get('FRONT_GATEWAY_URL')
  };

  const entryPoint = shared.createAppEntryPoint();
  yield entryPoint.appProviders.authProvider.loginWithCookie(this.cookies);
  // set route will also trigger any data-fetching needed for the requested route
  yield setRoute(entryPoint.router, this.path);
  // the stores are now filled with any data that was fetched
  const initialState = entryPoint.appStore.toJson();
  setRequestRenderState(this, entryPoint.appStore);
  const appHtml = renderToString(entryPoint.app);
  yield this.render('index', { appHtml, initialState, envVars });
}

module.exports = {
  renderApp
};
