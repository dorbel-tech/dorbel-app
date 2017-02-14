'use strict';
import director from 'director';
import { routingTable, login, errorPage } from './routes';

function checkAuth(appStore) {
  var callback = arguments[arguments.length - 1];
  if (appStore.authStore.isLoggedIn) {
    return callback();
  }
  appStore.setView(login);
  callback(false);
}

function setRoutes(router, appStore, appProviders) {
  // TODO : this shouldn't take long but it shouldn't run on every request
  // But I can't make it a singleton since appStore is different on every request

  routingTable.forEach(routeConfig => {
    var routeParams = routeConfig.route.split('/').filter(routePart => routePart.charAt(0) === ':').map(routePart => routePart.substring(1));

    const handleRoute = function() {
      const callback = arguments[arguments.length - 1]; // last argument director sends is the callback
      // the rest of the arguments are matched to the route params by order the appear
      const routeProps = {};
      routeParams.forEach((routeParam, index) => routeProps[routeParam] = arguments[index]);

      appStore.setView(routeConfig.view, routeProps);

      if (appProviders.isServer && routeConfig.view.serverPreRender) {
        routeConfig.view.serverPreRender(Object.assign({ router, appStore, appProviders }, routeProps))
          .then(callback)
          .catch(() => {
            appStore.setView(errorPage, { errorId: 500 }); // TODO: Catch real server error code and pass it here.
            callback();
          });
      } else {
        callback();
      }
    };

    router.on(routeConfig.route, routeConfig.requireLogin ? [ checkAuth.bind(null, appStore), handleRoute ] : handleRoute);
  });
}

function startRouter(appStore) {
  const router = new director.Router();

  if (process.env.IS_CLIENT) {
    router.configure({
      notfound: callback => notFound(appStore, callback),
      html5history: true,
      async: true,
      convert_hash_in_init: false // required for auth0 callback
    });

    // bug fix for https://github.com/flatiron/director/issues/312
    const oldSetRoute = router.setRoute;
    router.setRoute = function () {
      const origAgrs = arguments;
      if (window.onpopstate) {
        oldSetRoute.apply(router, origAgrs);
      } else {
        setTimeout(() => {
          router.setRoute.apply(router, origAgrs);
        }, 10);
      }

      // Report page view analytics to Segment.
      window.analytics.page({
        path: origAgrs[0],
        referrer: window.document.referrer,
        search: window.location.search,
        title: window.document.title,
        url: window.location.href
      });
    };

    router.goUpOneLevel = function () {
      const currentRoute = router.getRoute();
      currentRoute.pop();
      router.setRoute('/' + currentRoute.join('/'));
    };

    router.init();
  } else {
    router.configure({
      notfound: callback => notFound(appStore, callback),
      async: true
    });
  }

  router.setRoutes = function(appStore, appProviders) {
    setRoutes(router, appStore, appProviders);
  };

  return router;
}

function notFound(appStore, callback) {
  appStore.setView(errorPage, { errorId: 404 });
  callback();
}

module.exports = {
  startRouter
};
