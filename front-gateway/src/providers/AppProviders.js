/**
 * AppProviders will consolidate all the providers in the application
 * Providers should supply data to the stores, but not store any data themselves
 */
'use strict';
import AuthProvider from './AuthProvider';
import ApiProvider from './ApiProvider';
import ListingsProvider from './ListingsProvider';
import OheProvider from './OheProvider';
import CityProvider from './CityProvider';
import NeighborhoodProvider from './NeighborhoodProvider';
import CloudinaryProvider from './CloudinaryProvider';

const isServer = !global.window;

class AppProviders {
  constructor(appStore, router) {
    if (!isServer) {
      if (!window.dorbelConfig.AUTH0_FRONT_CLIENT_ID || !window.dorbelConfig.AUTH0_DOMAIN) {
        throw new Error('must set auth0 env vars');
      }
      this.authProvider = new AuthProvider(window.dorbelConfig.AUTH0_FRONT_CLIENT_ID, window.dorbelConfig.AUTH0_DOMAIN, appStore.authStore, router);
    }

    this.cloudinaryProvider = new CloudinaryProvider();

    this.apiProvider = new ApiProvider(appStore);
    this.oheProvider = new OheProvider(appStore, this.apiProvider);
    this.apartmentsProvider = new ApartmentsProvider(appStore, 
      { api: this.apiProvider, cloudinary: this.cloudinaryProvider, ohe: this.oheProvider });
    this.cityProvider = new CityProvider(appStore, this.apiProvider);
    this.neighborhoodProvider = new NeighborhoodProvider(appStore, this.apiProvider);
  }
}

module.exports = AppProviders;
