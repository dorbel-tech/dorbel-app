'use strict';
import ListingStore from '~/stores/ListingStore';
import OheStore from '~/stores/OheStore';
import CityStore from '~/stores/CityStore';
import NeighborhoodStore from '~/stores/NeighborhoodStore';
import AuthStore from '~/stores/AuthStore';
import EditedListingStore from '~/stores/EditedListingStore';
import SearchStore from '~/stores/SearchStore';
import LikeStore from '~/stores/LikeStore';
import DocumentStore from '~/stores/DocumentStore';
import { observable, action, autorun } from 'mobx';

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
  @observable showModal = false;
  @observable metaData = { title: undefined }; // used for SSR page meta data

  constructor(initialState = {}) {
    this.authStore = new AuthStore(initialState.authStore);
    this.listingStore = new ListingStore(initialState.listingStore, this.authStore);
    this.oheStore = new OheStore(initialState.oheStore);
    this.cityStore = new CityStore(initialState.cityStore);
    this.neighborhoodStore = new NeighborhoodStore(initialState.neighborhoodStore);
    this.newListingStore = new EditedListingStore(this.authStore, { localStorageKey: 'newListingStoreState' });
    this.editedListingStore = new EditedListingStore(this.authStore);
    this.searchStore = new SearchStore(initialState.searchStore);
    this.likeStore = new LikeStore(initialState.likeStore);
    this.documentStore = new DocumentStore();
    this.metaData = initialState.metaData || {};

    autorun(() => {
      // this is for changing the document title on the client side
      if (process.env.IS_CLIENT && this.metaData.title) {
        document.title = this.metaData.title;
      }
    });
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
      neighborhoodStore: this.neighborhoodStore.toJson(),
      authStore: this.authStore.toJson(),
      metaData: this.metaData
    };
  }
}
