'use strict';
import AuthProvider from './AuthProvider';
import ApiProvider from './ApiProvider';

const isServer = !global.window;

class AppProviders {
  constructor(appStore) {
    if (!isServer) {
      if (!dorbelConfig.AUTH0_CLIENT_ID || !dorbelConfig.AUTH0_DOMAIN) throw new Error('must set auth0 env vars');
      this.authProvider = new AuthProvider(dorbelConfig.AUTH0_CLIENT_ID, dorbelConfig.AUTH0_DOMAIN, appStore.authStore);
    }

    this.apiProvider = new ApiProvider(appStore);
  }
}

module.exports = AppProviders;
