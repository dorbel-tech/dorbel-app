'use strict';
import Dashboard from '~/components/Dashboard/Dashboard';
import Search from '~/components/Search/Search';
import Listing from '~/components/Listing/Listing';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import Health from '~/components/Health';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';

const routes = [
  { route: '/', view: Home },
  { route: '/health', view: Health },
  { route: '/login', view: Login },
  { route: '/dashboard', view: Dashboard, requireLogin: true },
  { route: '/dashboard/:action', view: Dashboard, requireLogin: true },
  { route: '/dashboard/:action/:propertyId', view: Dashboard, requireLogin: true },
  { route: '/apartments', view: Search },
  { route: '/apartments/new_form', view: UploadApartmentForm },
  { route: '/apartments/:listingId', view: Listing },
  { route: '/apartments/:listingId/:action', view: Listing, requireLogin: true },
  { route: '/apartments/:listingId/:action/:oheId', view: Listing, requireLogin: true }
];

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage
};
