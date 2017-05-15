/**
 * Nav provider handles navigation across the app
 */
'use strict';
import autobind from 'react-autobind';

class NavProvider {
  constructor(router) {
    this.router = router;
    autobind(this);
  }

  handleHrefClick(e) {
    e.preventDefault(); // cancel the event so we don't get a reload.
    const destination = e.currentTarget.href;
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(destination);
    }
    else {
      // check if href is a route
      if (destination.startsWith('http')) {
        location.href = destination;
      }
      else {
        this.router.setRoute(destination);
      }
    }
    return false;
  }
}


module.exports = NavProvider;
