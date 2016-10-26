/**
* AppProviders will consolidate all the providers in the application
* Providers should supply data to the stores, but not store any data themselves
*/
'use strict';
import AuthProvider from './AuthProvider';
import ApiProvider from './ApiProvider';

const isServer = !global.window;

class AppProviders {
  constructor(appStore) {
    if (!isServer) {
      if (!window.dorbelConfig.AUTH0_CLIENT_ID || !window.dorbelConfig.AUTH0_DOMAIN) {
        throw new Error('must set auth0 env vars');
      }
      this.authProvider = new AuthProvider(window.dorbelConfig.AUTH0_CLIENT_ID, window.dorbelConfig.AUTH0_DOMAIN, appStore.authStore);
    }

    this.apiProvider = new ApiProvider(appStore);
  }
}

module.exports = AppProviders;
