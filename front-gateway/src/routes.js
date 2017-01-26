'use strict';
import Apartments from '~/components/Apartments/Apartments';
import Apartment from '~/components/Apartment/Apartment';
import Home from '~/components/Home';
import ErrorPage from '~/components/ErrorPage';
import Login from '~/components/Login';
import UploadApartmentForm from '~/components/UploadApartmentForm/UploadApartmentForm';

const routes = [
  { route: '/', view: Home },
  { route: '/login', view: Login },
  { route: '/apartments', view: Apartments },
  { route: '/apartments/new_form', view: UploadApartmentForm },
  { route: '/apartments/:apartmentId/:action/:oheId', view: Apartment },
  { route: '/apartments/:apartmentId/:action', view: Apartment },
  { route: '/apartments/:apartmentId', view: Apartment },
  { route: '/error/:errorId', view: ErrorPage}
];

module.exports = {
  routingTable: routes,
  login: Login,
  home: Home,
  errorPage: ErrorPage
};
