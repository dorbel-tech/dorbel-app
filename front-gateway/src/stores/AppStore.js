'use strict';
import ApartmentStore from '~/stores/ApartmentStore';
import OheStore from '~/stores/OheStore';
import CityStore from '~/stores/CityStore';
import NeighborhoodStore from '~/stores/NeighborhoodStore';
import AuthStore from '~/stores/AuthStore';
import NewListingStore from '~/stores/NewListingStore';
import { observable, action } from 'mobx';

// A wrapper for all the stores that the application uses
export default class AppStore {
  apartmentStore: ApartmentStore;
  oheStore: OheStore;
  authStore: AuthStore;
  cityStore: CityStore;
  neighborhoodStore: NeighborhoodStore;

  // routing params
  @observable currentView: string;
  @observable routeParams: {[id: string]: string};

  constructor(initialState = {}) {
    this.apartmentStore = new ApartmentStore(initialState.apartmentStore);
    this.oheStore = new OheStore(initialState.oheStore);
    this.cityStore = new CityStore(initialState.cityStore);
    this.neighborhoodStore = new NeighborhoodStore(initialState.neighborhoodStore);
    this.authStore = new AuthStore();
    this.newListingStore = new NewListingStore();
  }

  @action setView(route, params) {
    this.currentView = route;
    this.routeParams = params;
  }

  toJson() {
    return {
      apartmentStore: this.apartmentStore.toJson(),
      oheStore: this.oheStore.toJson(),
      cityStore: this.cityStore.toJson(),
      neighborhoodStore: this.neighborhoodStore.toJson() 
    };
  }

}
