'use strict';
import { renderToString } from 'react-dom/server';
import 'ignore-styles';
import shared from '~/app.shared';

function* renderApp() {
  const entryPoint = shared.injectStores();
  entryPoint.router.dispatch('on', this.path);
  const initialState = entryPoint.appStore.toJson();
  const appHtml = renderToString(entryPoint.app);
  yield this.render('index', { appHtml, initialState });
}

module.exports = {
  renderApp
};
