'use strict';
import React from 'react';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import routes from '~/routes';
import shared from '~/app.shared';

function matchRoute(location) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (err, redirect, props) => {
      if (err) reject(err);
      else resolve({ props, redirect });
    });
  });
}

function* renderApp() {
  const { props, redirect } = yield matchRoute(this.path);

  if (redirect) {
    this.redirect(redirect.pathname + redirect.search);
  }
  else if (props) {
    const entryPoint = shared.injectStores(<RouterContext {...props} />);
    const initialState = entryPoint.appState.toJson();
    const appHtml = renderToString(entryPoint.app);
    yield this.render('index', { appHtml, initialState });
  }
  else {
    this.status = 404;
    this.body = 'Not Found';
  }
}

module.exports = {
  renderApp
};
