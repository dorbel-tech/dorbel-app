import { observable, asMap, computed } from 'mobx'; 
import autobind from 'react-autobind'; 
 
export default class RelatedListingsStore { 
   @observable listingsById = asMap({});

  constructor() {
    autobind(this);
  }

  @computed get relatedListings() {
    return this.listingsById.values();
  }

  add(listings) {
    listings
      .forEach((listing) => {
        this.listingsById.set(listing.id, listing);
      });
  }

  toJson() {
    return { };
  }
 
} 
