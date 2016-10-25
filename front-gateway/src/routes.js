import director from 'director';
// import { autorun } from 'mobx';

import About from '~/components/About/About';
import Apartments from '~/components/Apartments';
import Apartment from '~/components/Apartment';
import Home from '~/components/Home';
import Login from '~/components/Login';
import Profile from '~/components/Profile';

function startRouter(appStore) {
  function checkAuth() {
    var callback = arguments[arguments.length - 1];
    if (appStore.authStore.isLoggedIn) return callback();
    appStore.setView(Login);
    callback(false);
  }

  const routes = {
    '/': () => appStore.setView(Home),
    '/about': () => appStore.setView(About),
    '/login': () => appStore.setView(Login),
    '/apartments': () => appStore.setView(Apartments),
    '/apartments/:apartmentId': [
      checkAuth,
      (id) => appStore.setView(Apartment, { apartmentId: id })
    ],
    '/profile': [
      checkAuth,
      () => appStore.setView(Profile)
    ]
  };

  const router = new director.Router(routes);

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
      if (window.onpopstate) {
        oldSetRoute.apply(router, arguments);
      } else {
        setTimeout(function () {
          router.setRoute.apply(router, arguments);
        }, 10);
      }
    };

    router.init();
  } else {
    router.configure({
      notfound: () => appStore.setView(Home),
      async: true
    });
  }

  return router;
}

module.exports = {
  startRouter
};
