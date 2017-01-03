import director from 'director';
// import { autorun } from 'mobx';

import About from '~/components/About/About';
import Listings from '~/components/Listings/Listings';
import Listing from '~/components/Listing/Listing';
import Home from '~/components/Home';
import Login from '~/components/Login';
import Profile from '~/components/Profile';
import UploadListingForm from '~/components/UploadListingForm/UploadListingForm';

function startRouter(appStore) {
  function checkAuth() {
    var callback = arguments[arguments.length - 1];
    if (appStore.authStore.isLoggedIn) {
      return callback();
    }
    appStore.setView(Login);
    callback(false);
  }

  const routes = {
    '/': () => appStore.setView(Home),
    '/about': () => appStore.setView(About),
    '/login': () => appStore.setView(Login),
    '/apartments': () => appStore.setView(Listings),
    '/apartments/new_form': () => appStore.setView(UploadListingForm),
    // TODO : can this look better with nested routes ? 
    '/apartments/:apartmentId/:action/:oheId': (apartmentId, action, oheId) => appStore.setView(Listing, { apartmentId, action, oheId }),
    '/apartments/:apartmentId/:action': (apartmentId, action) => appStore.setView(Listing, { apartmentId, action }),
    '/apartments/:apartmentId': (apartmentId) => appStore.setView(Listing, { apartmentId }),
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
      const origAgrs = arguments;
      if (window.onpopstate) {
        oldSetRoute.apply(router, origAgrs);
      } else {
        setTimeout(() => {
          router.setRoute.apply(router, origAgrs);
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
