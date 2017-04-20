'use strict';
import Dashboard from '~/components/Dashboard/Dashboard';
import Search from '~/components/Search/Search';
import Listing from '~/components/Listing/Listing';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import Health from '~/components/Health';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';

const APARTMENTS_PREFIX = '/apartments';
const DASHBOARD_PREFIX = '/dashboard';

const routes = [
  { route: '/', view: Home },
  { route: '/health', view: Health },
  { route: '/login', view: Login },
  { route: APARTMENTS_PREFIX, view: Search },
  { route: APARTMENTS_PREFIX + '/new_form', view: UploadApartmentForm },
  { route: APARTMENTS_PREFIX + '/:listingId', view: Listing },
  { route: APARTMENTS_PREFIX + '/:listingId/:action', view: Listing, requireLogin: true },
  { route: APARTMENTS_PREFIX + '/:listingId/:action/:oheId', view: Listing, requireLogin: true },
  { route: DASHBOARD_PREFIX, view: Dashboard, requireLogin: true },
  { route: DASHBOARD_PREFIX + '/:action', view: Dashboard, requireLogin: true },
  { route: DASHBOARD_PREFIX + '/:action/:propertyId', view: Dashboard, requireLogin: true },
  { route: DASHBOARD_PREFIX + '/:action/:propertyId/:tab', view: Dashboard, requireLogin: true }
];

function getListingPath(listing) {
  return APARTMENTS_PREFIX + '/' + (listing.slug || listing.id);
}

function getDashMyPropsPath(listing, addPath = '') {
  return DASHBOARD_PREFIX + '/my-properties/' + listing.id + addPath;
}

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage,
  getListingPath,
  getDashMyPropsPath
};
