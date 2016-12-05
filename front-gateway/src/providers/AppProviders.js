/**
* AppProviders will consolidate all the providers in the application
* Providers should supply data to the stores, but not store any data themselves
*/
'use strict';
import AuthProvider from './AuthProvider';
import ApiProvider from './ApiProvider';
import ApartmentsProvider from './ApartmentsProvider';
import CityProvider from './CityProvider';
import CloudinaryProvider from './CloudinaryProvider';

const isServer = !global.window;

class AppProviders {
  constructor(appStore) {
    if (!isServer) {
      if (!window.dorbelConfig.AUTH0_FRONT_CLIENT_ID || !window.dorbelConfig.AUTH0_DOMAIN) {
        throw new Error('must set auth0 env vars');
      }
      this.authProvider = new AuthProvider(window.dorbelConfig.AUTH0_FRONT_CLIENT_ID, window.dorbelConfig.AUTH0_DOMAIN, appStore.authStore);
    }

    this.cloudinaryProvider = new CloudinaryProvider();

    this.apiProvider = new ApiProvider(appStore);
    this.apartmentsProvider = new ApartmentsProvider(appStore, this.apiProvider, this.cloudinaryProvider);
    this.cityProvider = new CityProvider(appStore, this.apiProvider);
  }
}

module.exports = AppProviders;
