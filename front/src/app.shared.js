'use strict';
import React from 'react';
import { Provider } from 'mobx-react';
import AppStore from '~/stores/AppStore';

function injectStores(appJsx, initialState) {
  const appStore = new AppStore(initialState);

  const app = (
    <Provider appStore={appStore}>
      {appJsx}
    </Provider>
  );

  return { app, appStore };
}

module.exports = {
  injectStores
};
