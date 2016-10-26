import { observable } from 'mobx';

export default class ApartmentStore {
  @observable apartments;

  constructor(initialState) {
    if (initialState) {
      this.apartments = initialState.apartments;
    }
    else this.apartments = [];
  }

  toJson() {
    return {
      apartments: this.apartments
    };
  }

}
