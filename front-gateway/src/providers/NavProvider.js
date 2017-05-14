/**
 * Like provider communicates with the Apartments API to get user likes
 */
'use strict';

class NavProvider {
  constructor(router) {
    this.router = router;
  }

  navigate(e, link) {
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(link);
    } else if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }
}


module.exports = NavProvider;
