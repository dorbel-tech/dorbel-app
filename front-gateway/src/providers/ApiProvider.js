/**
 * ApiProvider supplies infrastructure for calling the API layer
 */
'use strict';
import axios from 'axios';
import _ from 'lodash';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
let urlPrefix = '';

if (!process.env.IS_CLIENT) {
  // TODO: on the server we should make direct calls to the API's
  // instead of that we are making the calls from the server to itself and they go through the gateway
  const port = process.env.PORT || 3001;
  urlPrefix = 'http://127.0.0.1:' + port;
}

class ApiProvider {
  constructor(appStore) {
    this.appStore = appStore;

        // TODO : need a separate client for the OHE api or maybe to merge GQL schemas.
    const networkInterface = createNetworkInterface({ uri: urlPrefix + '/api/apartments/graphql' });
    networkInterface.use([{
      applyMiddleware(req, next) {
        req.options.headers = req.options.headers || {};
        if (appStore.authStore.isLoggedIn) {
          req.options.headers['Authorization'] = 'Bearer ' + appStore.authStore.idToken;
        }
        next();
      }
    }]);
    this.apolloClient = new ApolloClient({ networkInterface });
  }

  fetch(url, options){
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (this.appStore.authStore.isLoggedIn) {
      headers['Authorization'] = 'Bearer ' + this.appStore.authStore.idToken;
    }

    return axios({
      url: urlPrefix + url,
      headers,
      ...options
    })
    .then(res => res.data);
  }

  gqlCommand(type, options) {
    return this.apolloClient[type](options)
    .catch(err => {
      err.message = err.message.replace('GraphQL error: ', '');
      throw err;
    });
  }

  gql(query, options) {
    return this.gqlCommand('query', {
      query,
      ...options
    });
  }

  mutate(mutation, options) {
    return this.gqlCommand('mutate', {
      mutation,
      ...options
    });
  }
}

module.exports = ApiProvider;

