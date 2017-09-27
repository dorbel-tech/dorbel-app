'use strict';
import Dashboard from '~/components/Dashboard/Dashboard';
import Search from '~/components/Search/Search';
import Listing from '~/components/Listing/Listing';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import Health from '~/components/Health';
import UploadApartmentForm from '~/components/ApartmentForm/UploadApartmentForm';
import routesHelper from './routesHelper';

const routes = [
  { route: '/', view: Home },
  { route: '/health', view: Health },
  { route: '/login', view: Login },
  { route: routesHelper.SEARCH_PREFIX, view: Search },
  { route: routesHelper.PROPERTIES_PREFIX + '/submit', view: UploadApartmentForm },
  { route: routesHelper.PROPERTIES_PREFIX + '/submit/:mode', view: UploadApartmentForm },
  { route: routesHelper.PROPERTIES_PREFIX + '/:apartmentId', view: Listing },
  { route: routesHelper.PROPERTIES_PREFIX + '/:apartmentId/:action', view: Listing, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX, view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/:action', view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/my-profile/:tab', view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/:action/:listingId', view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/:action/:listingId/:tab', view: Dashboard, requireLogin: true }
];

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage
};
