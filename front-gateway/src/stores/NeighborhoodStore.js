import { observable } from 'mobx';

export default class NeighborhoodStore {
  @observable neighborhoodsByCityId;

  constructor() {
    this.neighborhoodsByCityId = observable.map({});
  }

  toJson() {
    return {};
  }
}
