'use strict';
import React from 'react';
import { action } from 'mobx';
import { Provider } from 'mobx-react';
import App from '~/components/App';
import { startRouter } from '~/routes';
import AppStore from '~/stores/AppStore';
import AppProviders from '~/providers/AppProviders';

function injectStores(initialState) {
  const appStore = new AppStore(initialState);
  const router = startRouter(appStore);
  const appProviders = new AppProviders(appStore, router);
  router.setRoutes(appStore, appProviders);

  const app = (
    <Provider appStore={appStore} router={router} appProviders={appProviders}>
      <App />
    </Provider>
  );

  return { app, appStore, router };
}

module.exports = {
  injectStores: action(injectStores)
};
