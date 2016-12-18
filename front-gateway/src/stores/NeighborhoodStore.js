import { observable, asMap } from 'mobx';

export default class NeighborhoodStore {
  @observable neighborhoodsByCityId;

  constructor() {
    this.neighborhoodsByCityId = asMap({});
  }

  toJson() {
    return {};
  }
}
