'use strict';
require('babel-register');
require('babel-polyfill');
require('ignore-styles');

const renderToString = require('react-dom/server').renderToString;
const _ = require('lodash');
const request = require('axios');
const shared = require('./app.shared.js');
const clientEnvVarsProvider = require('./server/clientEnvVarsProvider');

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

async function renderApp(ctx) {
  // Redirecting from root to main website.
  if (process.env.NODE_ENV === 'production' && ctx.path === '/') {
    ctx.status = 301;
    return ctx.redirect('https://www.dorbel.com');
  }

  // Old properties  page redirect to apartments page.
  if (ctx.path.startsWith('/properties/')) {
    const apartmentId = ctx.path.split('/').pop(-1); // Get apartmentId from path.
    const url = `${ctx.protocol}://${ctx.host}/api/apartments/v1/listings/by-apartment/${apartmentId}`;

    return request.get(url) // Get listing from apartments-api.
      .then(response => {
        ctx.status = 301;
        return ctx.redirect('/apartments/' + response.data.id + ctx.search);
      })
      .catch(() => { // If listing wasn't found.
        return ctx.redirect('/search');
      });
  }

  const clientSideEnvVars = clientEnvVarsProvider.getClientSideEnvVars();

  const entryPoint = shared.createAppEntryPoint();
  await entryPoint.appProviders.authProvider.loginWithCookie(ctx.cookies);
  // set route will also trigger any data-fetching needed for the requested route
  await setRoute(entryPoint.router, ctx);
  // the stores are now filled with any data that was fetched
  const initialState = entryPoint.appStore.toJson();
  setRequestRenderState(ctx, entryPoint.appStore);
  const appHtml = renderToString(entryPoint.app);
  await ctx.render('index', { appHtml, initialState, envVars: clientSideEnvVars });
}

module.exports = {
  renderApp
};
