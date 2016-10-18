'use strict';
import ApartmentStore from '~/stores/ApartmentStore';

// A wrapper for all the stores that the application uses
export default class AppStore {
  apartmentStore: ApartmentStore;

  constructor(initialState = {}) {
    this.apartmentStore = new ApartmentStore(initialState.apartmentStore);
  }

  toJson() {
    return {
      apartmentStore: this.apartmentStore.toJson()
    };
  }

}
