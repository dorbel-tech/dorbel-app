'use strict';
import Dashboard from '~/components/Dashboard/Dashboard';
import Search from '~/components/Search/Search';
import Listing from '~/components/Listing/Listing';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import Health from '~/components/Health';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';
import routesHelper from './routesHelper';

const routes = [
  { route: '/', view: Home },
  { route: '/health', view: Health },
  { route: '/login', view: Login },
  { route: routesHelper.APARTMENTS_PREFIX, view: Search },
  { route: routesHelper.APARTMENTS_PREFIX + '/new_form', view: UploadApartmentForm },
  { route: routesHelper.APARTMENTS_PREFIX + '/:listingId', view: Listing },
  { route: routesHelper.APARTMENTS_PREFIX + '/:listingId/:action', view: Listing, requireLogin: true },
  { route: routesHelper.APARTMENTS_PREFIX + '/:listingId/:action/:oheId', view: Listing, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX, view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/:action', view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/:action/:propertyId', view: Dashboard, requireLogin: true },
  { route: routesHelper.DASHBOARD_PREFIX + '/:action/:propertyId/:tab', view: Dashboard, requireLogin: true }
];

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage
};
