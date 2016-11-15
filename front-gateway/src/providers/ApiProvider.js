/**
 * ApiProvider supplies infrastructure for calling the API layer
 */
'use strict';
import axios from 'axios';

class ApiProvider {
  constructor(appStore) {
    this.appStore = appStore;
  }

  fetch(url, options){
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (this.appStore.authStore.isLoggedIn){
      headers['Authorization'] = 'Bearer ' + this.appStore.authStore.getToken();
    }

    return axios({
      url,
      headers,
      ...options
    })
    .then(res => res.data);
  }  
}

module.exports = ApiProvider;

