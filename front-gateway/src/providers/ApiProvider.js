/**
 * ApiProvider supplies infrastructure for calling the API layer
 */
'use strict';
import axios from 'axios';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

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
    this.apolloClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: urlPrefix + '/api/apartments/graphql'
      })
    });
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

  gql(query, variables) {
    return this.apolloClient.query({
      query: gql(query),
      variables
    });
  }
}

module.exports = ApiProvider;

