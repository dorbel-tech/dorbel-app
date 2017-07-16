'use strict';
import { observable } from 'mobx';

export default class DocumentStore {
  @observable documentsById;
  
  constructor() {
    this.documentsById = observable.map({});
  }

  add(documents) {
    documents.forEach(document => this.documentsById.set(document.id, document));
  }

  getDocumentsByListing(listing_id) {
    return this.documentsById.values().filter(document => document.listing_id === listing_id);
  }

  remove(document) {
    this.documentsById.delete(document.id);
  }
}
