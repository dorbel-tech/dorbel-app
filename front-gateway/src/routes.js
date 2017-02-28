'use strict';
import Search from '~/components/Search/Search';
import Apartment from '~/components/Apartment/Apartment';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import Health from '~/components/Health';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';

const routes = [
  { route: '/', view: Home },
  { route: '/health', view: Health },
  { route: '/login', view: Login },
  { route: '/apartments', view: Search },
  { route: '/apartments/new_form', view: UploadApartmentForm },
  { route: '/apartments/:apartmentId', view: Apartment },
  { route: '/apartments/:apartmentId/:action', view: Apartment, requireLogin: true },
  { route: '/apartments/:apartmentId/:action/:oheId', view: Apartment, requireLogin: true }
];

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage
};
