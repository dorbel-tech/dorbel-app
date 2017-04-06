/**
 * AppProviders will consolidate all the providers in the application
 * Providers should supply data to the stores, but not store any data themselves
 */
'use strict';
import ApiProvider from './ApiProvider';
import ListingsProvider from './ListingsProvider';
import OheProvider from './OheProvider';
import CityProvider from './CityProvider';
import NeighborhoodProvider from './NeighborhoodProvider';
import CloudinaryProvider from './CloudinaryProvider';
import NotificationProvider from './NotificationProvider';
import ModalProvider from './ModalProvider';
import SearchProvider from './SearchProvider';
import LikeProvider from './LikeProvider';

import utils from './utils';

function loadAuthProvider(appStore, router, apiProvider) {
  if (process.env.IS_CLIENT) {
    if (!window.dorbelConfig.AUTH0_FRONT_CLIENT_ID || !window.dorbelConfig.AUTH0_DOMAIN) {
      throw new Error('must set auth0 env vars');
    }
    const ClientAuthProvider = require('./auth/AuthProvider.client');
    return new ClientAuthProvider(window.dorbelConfig.AUTH0_FRONT_CLIENT_ID, window.dorbelConfig.AUTH0_DOMAIN, appStore.authStore, router, apiProvider);
  } else {
    const ServerAuthProvider = require('./auth/AuthProvider.server');
    return new ServerAuthProvider(appStore.authStore);
  }
}

class AppProviders {
  constructor(appStore, router) {
    this.cloudinaryProvider = new CloudinaryProvider();
    this.apiProvider = new ApiProvider(appStore);
    this.authProvider = loadAuthProvider(appStore, router, this.apiProvider);
    this.oheProvider = new OheProvider(appStore, this.apiProvider);
    this.listingsProvider = new ListingsProvider(appStore,
      { api: this.apiProvider, cloudinary: this.cloudinaryProvider, ohe: this.oheProvider });
    this.cityProvider = new CityProvider(appStore, this.apiProvider);
    this.neighborhoodProvider = new NeighborhoodProvider(appStore, this.apiProvider);
    this.notificationProvider = new NotificationProvider();
    this.modalProvider = new ModalProvider(appStore);
    this.searchProvider = new SearchProvider(appStore, { api: this.apiProvider, ohe: this.oheProvider });
    this.likeProvider = new LikeProvider(appStore, this.apiProvider);
    this.utils = utils;
  }
}

module.exports = AppProviders;

