'use strict';
import React from 'react';
import { match, RouterContext } from 'react-router';
import ApartmentStore from '~/stores/ApartmentStore';
import routes from '~/routes';
import { renderToString } from 'react-dom/server';
import { Provider } from 'mobx-react';

// TODO - providers are being set up here as well as in Router.jsx - should be combined

function* renderReact() {
  let appHtml;
  const apartmentStore = new ApartmentStore();
  const initialState = { apartmentStore: apartmentStore.toJson() };

  match({ routes: routes, location: this.path }, (err, redirect, props) => {
    if (err) {
      this.status = 500;
      this.body = err.message;
    }
    else if (redirect) {
      this.redirect(redirect.pathname + redirect.search);
    }
    else if (props) {
      console.log(props.components);
      appHtml = renderToString(<Provider apartmentStore={apartmentStore}><RouterContext {...props}/></Provider>);
    }
    else {
      // no errors, no redirect, we just didn't match anything
      this.status = 404;
      this.body = 'Not Found';
    }
  });

  yield this.render('index', { appHtml, initialState });
}

module.exports = {
  renderReact
};
