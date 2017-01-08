'use strict';
import ListingStore from '~/stores/ListingStore';
import OheStore from '~/stores/OheStore';
import CityStore from '~/stores/CityStore';
import NeighborhoodStore from '~/stores/NeighborhoodStore';
import AuthStore from '~/stores/AuthStore';
import NewListingStore from '~/stores/NewListingStore';
import { observable, action } from 'mobx';

// A wrapper for all the stores that the application uses
export default class AppStore {
  listingStore: ListingStore;
  oheStore: OheStore;
  authStore: AuthStore;
  cityStore: CityStore;
  neighborhoodStore: NeighborhoodStore;

  // routing params
  @observable currentView: string;
  @observable routeParams: {[id: string]: string};

  constructor(initialState = {}) {
    this.authStore = new AuthStore();
    this.listingStore = new ListingStore(initialState.listingStore);
    this.oheStore = new OheStore(initialState.oheStore);
    this.cityStore = new CityStore(initialState.cityStore);
    this.neighborhoodStore = new NeighborhoodStore(initialState.neighborhoodStore);
    this.newListingStore = new NewListingStore();
  }

  @action setView(route, params) {
    this.currentView = route;
    this.routeParams = params;
  }

  toJson() {
    return {
      listingStore: this.listingStore.toJson(),
      oheStore: this.oheStore.toJson(),
      cityStore: this.cityStore.toJson(),
      neighborhoodStore: this.neighborhoodStore.toJson() 
    };
  }

}
