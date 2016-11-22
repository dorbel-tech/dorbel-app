/**
 * This store should hold the values of the upload-apartment-form while it is being filled
 */

import { observable } from 'mobx';

export default class NewListingStore {
  @observable images = [];

  toJson() {
    return {
      images: this.images
    };
  }

}
