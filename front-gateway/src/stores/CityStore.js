import { observable } from 'mobx';

export default class CityStore {
  @observable cities;

  constructor(initialState) {
    this.cities = initialState ? initialState.cities : [];
    console.log(this.cities)
  }

  toJson() {
    return {
      cities: this.cities
    };
  }
}
