'use-strict';
import { observable } from 'mobx';

export default class ListingStore {
  @observable filterChanged;
  @observable isLoading;
  @observable searchResults;

  constructor(initialState) {
    this.searchResults = initialState || [];
  }

  toJson() {
    return this.searchResults;
  }
}
