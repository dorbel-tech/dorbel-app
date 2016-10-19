'use strict';
import ApartmentStore from '~/stores/ApartmentStore';
import AuthStore from '~/stores/AuthStore';
import { observable, action } from 'mobx';

// A wrapper for all the stores that the application uses
export default class AppStore {
  apartmentStore: ApartmentStore;
  @observable currentView: string;
  @observable routeParams;

  constructor(initialState = {}) {
    this.apartmentStore = new ApartmentStore(initialState.apartmentStore);
    this.authStore = new AuthStore();
  }

  @action setView(route, params) {
    this.currentView = route;
    this.routeParams = params;
  }

  toJson() {
    return {
      apartmentStore: this.apartmentStore.toJson()
    };
  }

}
