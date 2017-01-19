import director from 'director';
// import { autorun } from 'mobx';

import About from '~/components/About/About';
import Apartments from '~/components/Apartments/Apartments';
import Apartment from '~/components/Apartment/Apartment';
import Home from '~/components/Home';
import Login from '~/components/Login';
import Profile from '~/components/Profile';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';

const routes = [
  { route: '/', view: Home },
  { route: '/about', view: About },
  { route: '/login', view: Login },
  { route: '/apartments', view: Apartments },
  { route: '/apartments/new_form', view: UploadApartmentForm },
  { route: '/apartments/:apartmentId/:action/:oheId', view: Apartment },
  { route: '/apartments/:apartmentId/:action', view: Apartment },
  { route: '/apartments/:apartmentId', view: Apartment },
  { route: '/profile', view: Profile, requireLogin: true }
];

function checkAuth(appStore) {
  var callback = arguments[arguments.length - 1];
  if (appStore.authStore.isLoggedIn) {
    return callback();
  }
  appStore.setView(Login);
  callback(false);
}

function setRoutes(router, appStore, appProviders) {
  // TODO : this shouldn't take long but it shouldn't run on every request
  // But I can't make it a singleton since appStore is different on every request

  routes.forEach(routeConfig => {
    var routeParams = routeConfig.route.split('/').filter(routePart => routePart.charAt(0) === ':').map(routePart => routePart.substring(1));

    const handleRoute = function() {
      const callback = arguments[arguments.length - 1]; // last argument director sends is the callback
      // the rest of the arguments are matched to the route params by order the appear
      const routeProps = {};
      routeParams.forEach((routeParam, index) => routeProps[routeParam] = arguments[index]);

      appStore.setView(routeConfig.view, routeProps);

      if (routeConfig.view.preRender) {
        routeConfig.view.preRender(Object.assign({ router, appStore, appProviders }, routeProps))
          .then(callback)
          .catch((err) => {
            console.error(err);
            appStore.setView(Home); // TODO : set to error view ?
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

  if (global.window) { // client side only
    router.configure({
      notfound: () => appStore.setView(Home),
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
      notfound: () => appStore.setView(Home),
      async: true
    });
  }

  router.setRoutes = function(appStore, appProviders) {
    setRoutes(router, appStore, appProviders);
  };

  return router;
}

module.exports = {
  startRouter
};
