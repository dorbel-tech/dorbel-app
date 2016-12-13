import { observable } from 'mobx';

export default class NeighborhoodStore {
  @observable neighborhoods;

  constructor(initialState) {
    this.neighborhoods = initialState ? initialState.neighborhoods : [];
  }

  toJson() {
    return {
      neighborhoods: this.neighborhoods
    };
  }

}
