/**
 * Nav provider handles navigation across the app
 */
'use strict';

class NavProvider {
  constructor(router) {
    this.router = router;
  }

  navigate(e, link) {
    e.preventDefault(); // cancel the event so we don't get a reload.
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(link);
    } else if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
    return false;
  }
}


module.exports = NavProvider;
