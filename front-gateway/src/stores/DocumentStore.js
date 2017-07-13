'use strict';
import { observable, asMap } from 'mobx';

export default class DocumentStore {
  @observable documentsById;
  
  constructor() {
    this.documentsById = asMap({});
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
