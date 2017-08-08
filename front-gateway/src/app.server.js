'use strict';
require('babel-register');
require('babel-polyfill');
require('ignore-styles');

const renderToString = require('react-dom/server').renderToString;
const _ = require('lodash');
const request = require('axios');
const shared = require('./app.shared.js');
const getCloudinaryParams = require('./server/cloudinaryConfigProvider').getCloudinaryParams;

function setRoute(router, context) {
  // this method is used to set the route in the server side and wait until it resolves (usually called 'callback' on router.js)
  return new Promise((resolve) => {
    router.dispatch('on', context.path, (errCode) => {
      if (errCode) {
        context.status = errCode;
      }
      resolve();
    });
  });
}

function setRequestRenderState(context, appStore) {
  // these are used to render the inital response in the index.ejs
  context.state = context.state || {};
  context.state.segment = process.env.SEGMENT_IO_WRITE_KEY; // segment key is not part of env vars but is used when rendering index.ejs
  context.state.optimizely = process.env.OPTIMIZELY_KEY; // optimizely key is not part of env vars but is used when rendering index.ejs
  context.state.hotjar = process.env.HOTJAR_KEY; // hotjar key is not part of env vars but is used when rendering index.ejs
  context.state.meta = _.defaults(appStore.metaData, {
    title: 'dorbel - מערכת לניהול ודירות להשכרה ללא תיווך',
    description: 'דירות להשכרה ללא תיווך. כל הפרטים שחשוב לדעת על הדירות להשכרה בכדי לחסוך ביקורים מיותרים. בחרו מועד והירשמו לביקור בדירות להשכרה בלחיצת כפתור.',
    image: {
      url: 'https://static.dorbel.com/images/meta/homepage-middle-image.jpg',
      width: 1093,
      height: 320
    },
    url: process.env.FRONT_GATEWAY_URL + context.path
  });

  // Adding query string to all meta urls.
  context.state.meta.url += context.search;
}

function* renderApp() {
  // Redirecting from root to main website.
  if (process.env.NODE_ENV === 'production' && this.path === '/') {
    this.status = 301;
    return this.redirect('https://www.dorbel.com');
  }

  // Old apartment submit form to new one redirect.
  if (this.path === '/apartments/new' || this.path === '/apartments/new_form') {
    this.status = 301;
    return this.redirect('/properties/submit');
  }

  // Old apartments search redirect to new one.
  if (this.path === '/apartments' || this.path.startsWith('/apartments?q=')) {
    this.status = 301;
    return this.redirect('/search' + this.search);
  }

  // Old apartments page redirect to properties page.
  if (this.path.startsWith('/apartments/')) {
    const listingId = this.path.split('/').pop(-1); // Get listingId from path.
    const url = `${this.protocol}://${this.host}/api/apartments/v1/listings/${listingId}`;

    return request.get(url) // Get listing from apartments-api.
      .then(response => {
        this.status = 301;
        return this.redirect('/properties/' + response.data.apartment_id + this.search);
      })
      .catch(() => { // If listing wasn't found.
        return this.redirect('/search');
      });
  }

  const clientSideEnvVars = _.pick(process.env, [ 'NODE_ENV', 'AUTH0_FRONT_CLIENT_ID', 'AUTH0_DOMAIN', 'GOOGLE_MAPS_API_KEY', 
    'FRONT_GATEWAY_URL', 'TALKJS_APP_ID', 'TALKJS_PUBLISHABLE_KEY', 'FILESTACK_API_KEY' ]);

  clientSideEnvVars.CLOUDINARY_PARAMS = getCloudinaryParams();

  const entryPoint = shared.createAppEntryPoint();
  yield entryPoint.appProviders.authProvider.loginWithCookie(this.cookies);
  // set route will also trigger any data-fetching needed for the requested route
  yield setRoute(entryPoint.router, this);
  // the stores are now filled with any data that was fetched
  const initialState = entryPoint.appStore.toJson();
  setRequestRenderState(this, entryPoint.appStore);
  const appHtml = renderToString(entryPoint.app);
  yield this.render('index', { appHtml, initialState, envVars: clientSideEnvVars });
}

module.exports = {
  renderApp
};
