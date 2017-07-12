/**
 * Nav provider handles navigation across the app
 */
'use strict';
import autobind from 'react-autobind';

class NavProvider {
  constructor(appStore, router) {
    this.router = router;
    this.appStore = appStore;
    autobind(this);
  }

  setRoute(route) {
    this.router.setRoute(route);
  }

  handleHrefClick(e) {
    e.preventDefault(); // cancel the event so we don't get a reload.

    if ((e.metaKey || e.ctrlKey || e.currentTarget.target) && window) { // open in new tab if ctrl is pressed or target is defined
      window.open(e.currentTarget.href);
    }
    else {
      // check if href is an external link
      if (location.host != e.currentTarget.host) {
        location.href = e.currentTarget.href;
      }
      else {
        this.appStore.showModal = false;
        this.router.setRoute(e.currentTarget.pathname);
      }
    }
    return false;
  }
}

module.exports = NavProvider;
