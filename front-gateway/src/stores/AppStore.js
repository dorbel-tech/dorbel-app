'use strict';
import AuthStore from '~/stores/AuthStore';
import DocumentStore from '~/stores/DocumentStore';
import EditedListingStore from '~/stores/EditedListingStore';
import LikeStore from '~/stores/LikeStore';
import ListingStore from '~/stores/ListingStore';
import MessagingStore from '~/stores/MessagingStore';
import OheStore from '~/stores/OheStore';
import SearchStore from '~/stores/SearchStore';

import { observable, action, autorun } from 'mobx';

import ErrorPage from '~/components/ErrorPage';

// A wrapper for all the stores that the application uses
export default class AppStore {
  authStore: AuthStore;
  listingStore: ListingStore;
  oheStore: OheStore;

  // routing params
  @observable currentView: string;
  @observable routeParams: { [id: string]: string };
  @observable showModal = false;
  @observable metaData = { title: undefined }; // used for SSR page meta data

  constructor(initialState = {}) {
    this.authStore = new AuthStore(initialState.authStore);
    this.listingStore = new ListingStore(initialState.listingStore, this.authStore);
    this.oheStore = new OheStore(initialState.oheStore);
    this.newListingStore = new EditedListingStore(this.authStore, { localStorageKey: 'newListingStoreState' });
    this.editedListingStore = new EditedListingStore(this.authStore);
    this.searchStore = new SearchStore(initialState.searchStore);
    this.likeStore = new LikeStore(initialState.likeStore);
    this.documentStore = new DocumentStore();
    this.messagingStore = new MessagingStore();
    this.metaData = initialState.metaData || {};

    autorun(() => {
      // this is for changing the document title on the client side
      if (process.env.IS_CLIENT && this.metaData.title) {
        document.title = this.metaData.title;
      }
    });
  }

  @action setView(component, params) {
    this.currentView = component;
    this.routeParams = params;
  }

  showErrorPage(errorId) {
    this.setView(ErrorPage, { errorId });
  }

  toJson() {
    return {
      listingStore: this.listingStore.toJson(),
      oheStore: this.oheStore.toJson(),
      authStore: this.authStore.toJson(),
      metaData: this.metaData
    };
  }
}
