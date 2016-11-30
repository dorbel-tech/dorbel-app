import { observable, asMap } from 'mobx';

export default class ApartmentStore {
  @observable apartments;
  @observable apartmentsById;

  constructor(initialState) {
    this.apartments = initialState ? initialState.apartments : [];
    this.apartmentsById = asMap({});
  }

  toJson() {
    return {
      apartments: this.apartments
    };
  }

}
