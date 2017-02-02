/**
 * ApiProvider supplies infrastructure for calling the API layer
 */
'use strict';
import axios from 'axios';
let urlPrefix = '';

if (!process.env.IS_CLIENT) {
  // TODO: on the server we should make direct calls to the API's
  // instead of that we are making the calls from the server to itself and they go through the gateway
  urlPrefix = 'http://127.0.0.1:' + require('dorbel-shared').config.get('PORT');
}

class ApiProvider {
  constructor(appStore) {
    this.appStore = appStore;
  }

  fetch(url, options){
    this.appStore.isLoading = true;

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
    .then((res) => {
        this.appStore.isLoading = false;
        return res.data;
      });
  }
}

module.exports = ApiProvider;

