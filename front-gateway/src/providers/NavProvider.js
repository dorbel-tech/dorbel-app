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

  navigate(e, link, isExternal) {
    e.preventDefault(); // cancel the event so we don't get a reload.
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(link);
    } else if (this.router.setRoute) {
      isExternal ? location.href = link : this.router.setRoute(link);
    }
    return false;
  }
}


module.exports = NavProvider;
