'use strict';
import React from 'react';
import { Provider } from 'mobx-react';
import { startRouter } from '~/routes';
import AppStore from '~/stores/AppStore';
import App from '~/components/App';

import AuthProvider from '~/providers/authProvider';

const isServer = !global.window;

function injectStores(initialState) {
  const appStore = new AppStore(initialState);
  const router = startRouter(appStore);

  let authProvider;

  if (!isServer) {
    if (!process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_DOMAIN) throw new Error('must set auth0 env vars');
    authProvider = new AuthProvider(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, appStore.authStore);
  }

  const app = (
    <Provider appStore={appStore} router={router} authProvider={authProvider}>
      <App />
    </Provider>
  );

  return { app, appStore, router };
}

module.exports = {
  injectStores
};
