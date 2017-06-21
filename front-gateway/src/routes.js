'use strict';
import Dashboard from '~/components/Dashboard/Dashboard';
import Search from '~/components/Search/Search';
import Listing from '~/components/Listing/Listing';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import Health from '~/components/Health';
import UploadApartmentForm from '~/components/ApartmentForm/UploadApartmentForm';
import SelectUploadMode from '~/components/ApartmentForm/SelectUploadMode';

const routes = [
  { route: '/', view: Home },
  { route: '/health', view: Health },
  { route: '/login', view: Login },
  { route: '/search', view: Search },
  { route: '/properties/submit', view: SelectUploadMode },
  { route: '/properties/submit/:mode', view: UploadApartmentForm },
  { route: '/properties/:apartmentId', view: Listing },
  { route: '/properties/:apartmentId/:action', view: Listing, requireLogin: true },
  { route: '/properties/:apartmentId/:action/:oheId', view: Listing, requireLogin: true },
  { route: '/dashboard', view: Dashboard, requireLogin: true },
  { route: '/dashboard/:action', view: Dashboard, requireLogin: true },
  { route: '/dashboard/:action/:listingId', view: Dashboard, requireLogin: true },
  { route: '/dashboard/:action/:listingId/:tab', view: Dashboard, requireLogin: true }
];

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage
};
