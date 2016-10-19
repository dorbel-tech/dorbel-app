import director from 'director';
// import { autorun } from 'mobx';

import About from '~/components/About';
import Apartments from '~/components/Apartments';
import Apartment from '~/components/Apartment';
import Home from '~/components/Home';

function startRouter(appStore) {
  const routes = {
    '/': () => appStore.setView(Home),
    '/apartments': () => appStore.setView(Apartments),
    '/apartments/:apartmentId': (id) => appStore.setView(Apartment, { apartmentId: id }),
    '/about': () => appStore.setView(About)
  };

  const router = new director.Router(routes);

  if (global.window) { // client side only
    router.configure({
      notfound: () => appStore.setView('notFound'),
      html5history: true
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
      notfound: () => appStore.setView('notFound')
    });
  }

  return router;
}

module.exports = {
  startRouter
};
