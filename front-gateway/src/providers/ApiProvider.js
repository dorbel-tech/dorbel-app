/**
 * ApiProvider supplies infrastructure for calling the API layer
 */
'use strict';
import { action } from 'mobx';

class ApiProvider {
  constructor(appStore) {
    this.appStore = appStore;
  }

  // TODO: this should be in a specific provider for the Apartments API
  @action
  loadApartments() {
    return this.fetch('/api/v1/apartments')
      .then(apartments => this.appStore.apartmentStore.apartments = apartments);
  }

  fetch(url, options){
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (this.appStore.authStore.isLoggedIn){
      headers['Authorization'] = 'Bearer ' + this.appStore.authStore.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
    .then(this._checkStatus)
    .then(response => response.json());
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}

module.exports = ApiProvider;

