import { observable, action } from 'mobx';

export default class ApartmentStore {
  @observable apartments;

  constructor(initialState) {
    if (initialState && initialState.apartmentStore && initialState.apartmentStore.apartments) {
      this.apartments = initialState.apartmentStore.apartments;
    }
    else this.apartments = [];
  }

  @action
  loadApartments() {
    console.log('loading apartments into store');
    if (this.apartments.length > 0 || !global.window) return [];

    return fetch('/api/v1/apartments')
      .then(response => response.json())
      .then(response => {
        this.apartments = response;
      });
  }

  toJson() {
    return {
      apartments: this.apartments
    };
  }

}
