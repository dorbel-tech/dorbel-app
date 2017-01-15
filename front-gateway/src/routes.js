import director from 'director';
// import { autorun } from 'mobx';

import About from '~/components/About/About';
import Apartments from '~/components/Apartments/Apartments';
import Apartment from '~/components/Apartment/Apartment';
import Home from '~/components/Home';
import Login from '~/components/Login';
import Profile from '~/components/Profile';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';

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
    '/apartments': () => appStore.setView(Apartments),
    '/apartments/new_form': () => appStore.setView(UploadApartmentForm),
    // TODO : can this look better with nested routes ? 
    '/apartments/:apartmentId/:action/:oheId': (apartmentId, action, oheId) => appStore.setView(Apartment, { apartmentId, action, oheId }),
    '/apartments/:apartmentId/:action': (apartmentId, action) => appStore.setView(Apartment, { apartmentId, action }),
    '/apartments/:apartmentId': (apartmentId) => appStore.setView(Apartment, { apartmentId }),
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

  return router;
}

module.exports = {
  startRouter
};
