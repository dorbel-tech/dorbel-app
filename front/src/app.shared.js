'use strict';
import React from 'react';
import { Provider } from 'mobx-react';
import { startRouter } from '~/routes';
import AppStore from '~/stores/AppStore';
import App from '~/components/App';
// import AuthProvider from '~/providers/authProvider';

// const isServer = !global.window;

function injectStores(initialState) {
  const appStore = new AppStore(initialState);
  const router = startRouter(appStore);

  // let authProvider;

  // if (!isServer) {
  //   // TODO : config config config
  //   authProvider = new AuthProvider('UyuPpE4zo4sUTcDYrGQrtTRY5eQHHULm', 'dorbel.eu.auth0.com', appStore.authStore);
  // }

  const app = (
    <Provider appStore={appStore} router={router}>
      <App />
    </Provider>
  );

  return { app, appStore, router };
}

module.exports = {
  injectStores
};
