'use strict';
import React from 'react';
import { Provider } from 'mobx-react';
import { ApolloProvider } from 'react-apollo';
import App from '~/components/App';
import { startRouter } from '~/router';
import AppStore from '~/stores/AppStore';
import AppProviders from '~/providers/AppProviders';

function createAppEntryPoint(initialState) {
  const appStore = new AppStore(initialState);
  const router = startRouter(appStore);
  const appProviders = new AppProviders(appStore, router);
  router.setRoutes(appStore, appProviders);

  const app = (
    <Provider appStore={appStore} router={router} appProviders={appProviders}>
      <ApolloProvider client={appProviders.apiProvider.apolloClient}>
        <App />
      </ApolloProvider>
    </Provider>
  );

  return { app, appStore, router, appProviders };
}

module.exports = {
  createAppEntryPoint
};
