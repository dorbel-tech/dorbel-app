import { observable } from 'mobx';

export default class CityStore {
  @observable cities;

  constructor(initialState) {
    this.cities = initialState ? initialState.cities : [];
  }

  toJson() {
    return {
      cities: this.cities
    };
  }

}
