/**
 * ApartmentsProvider communicates with the Apartments API
 */
'use strict';
import { action } from 'mobx';
import _ from 'lodash';
import moment from 'moment';

class ApartmentsProvider {
  constructor(appStore, apiProvider, cloudinaryProvider, relatedListingsProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.cloudinaryProvider = cloudinaryProvider;
    this.relatedListingsProvider = relatedListingsProvider;
  }

  loadApartments() {
    return this.apiProvider.fetch('/api/apartments/v1/listings')
      .then(this.appStore.listingStore.add);
  }

  loadFullListingDetails(id) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + id)
      .then(action('load-single-apartment', apartment => this.appStore.listingStore.listingsById.set(id,apartment)));
  }

  mapUploadApartmentFormToCreateListing(formValues) {
    let listing = {};
    // this is so we can use nested structure in our form attributes
    Object.keys(formValues).filter(key => formValues.hasOwnProperty(key)).forEach(key => _.set(listing, key, formValues[key]));
    listing.images = formValues.images.map((cloudinaryImage, index) => ({
      url: cloudinaryImage.secure_url, display_order: index
    }));

    return listing;
  }

  uploadApartment(formValues) {
    const listing = this.mapUploadApartmentFormToCreateListing(formValues);
    return this.apiProvider.fetch('/api/apartments/v1/listings', { method: 'POST', data: listing });
  }

  setTimeFromString(dateString, timeString) {
    return moment(dateString + 'T' + timeString + ':00.000Z').toJSON();    
  }

  @action
  uploadImage(file) {
    const imageStore = this.appStore.newListingStore.formValues.images;     
    const image = { complete: false, src: file.preview, progress: 0 };
    imageStore.push(image);

    const onProgress = action('image-upload-progress', e => image.progress = e.lengthComputable ? (e.loaded / e.total) : 0);
    
    return this.cloudinaryProvider.upload(file, onProgress)      
    .then(action('image-upload-done', uploadedImage => {
      image.complete = true;
      image.src = `http://res.cloudinary.com/dorbel/${uploadedImage.resource_type}/${uploadedImage.type}/c_fill,h_190,w_340/v${uploadedImage.version}/${uploadedImage.public_id}.${uploadedImage.format}`;
      image.delete_token = uploadedImage.delete_token;
      image.secure_url = uploadedImage.secure_url;
      return uploadedImage;      
    }))
    .catch(action(() => {
      imageStore.remove(image); // remove method is available as this is a mobx observable array
    }));
  }

  @action
  deleteImage(image) {
    this.appStore.newListingStore.formValues.images.remove(image);
    return this.cloudinaryProvider.deleteImage(image);      
  }
}

module.exports = ApartmentsProvider;
