import { observable } from 'mobx';

export default class ApartmentStore {
  @observable apartments;

  constructor(initialState) {
    this.apartments = initialState ? initialState.apartments : [];
  }

  toJson() {
    return {
      apartments: this.apartments
    };
  }

}
