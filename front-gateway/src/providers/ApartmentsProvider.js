/**
 * ApartmentsProvider communicates with the Apartments API
 */
'use strict';
import { action } from 'mobx';
import _ from 'lodash';

class ApartmentsProvider {
  constructor(appStore, providers) {
    this.appStore = appStore;
    this.apiProvider = providers.api;
    this.cloudinaryProvider = providers.cloudinary;
    this.oheProvider = providers.ohe;
  }

  loadApartments(query) {
    const q = encodeURIComponent(JSON.stringify(query || {}));
    return this.apiProvider.fetch('/api/apartments/v1/listings?q=' + q)
      .then(this.appStore.listingStore.add);
  }

  loadFullListingDetails(id) {
    return Promise.all([
      this.apiProvider.fetch('/api/apartments/v1/listings/' + id)
        .then(action('load-single-apartment', apartment => this.appStore.listingStore.listingsById.set(id,apartment))),
      this.oheProvider.loadListingEvents(id),
      this.oheProvider.getFollowsForListing(id)
    ]);
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
    return this.apiProvider.fetch('/api/apartments/v1/listings', { method: 'POST', data: listing })
      .then(newListing => this.oheProvider.createOhe(Object.assign({ listing_id: newListing.id }, formValues.open_house_event)));
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
      image.src = `http://res.cloudinary.com/dorbel/${uploadedImage.resource_type}/${uploadedImage.type}/v${uploadedImage.version}/${uploadedImage.public_id}.${uploadedImage.format}`;
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

  updateListingStatus(listingId, status) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId, { method: 'PATCH', data: { status } })
    .then((res) => {
      let listing = this.appStore.listingStore.listingsById.get(listingId);
      listing.status = status;
      _.set(listing, 'meta.possibleStatuses', _.get(res, 'meta.possibleStatuses'));
    });
  }

  getRelatedListings(listingId){
    return this.apiProvider.fetch('/api/apartments/v1/listings/'+listingId+'/related/');
  }
}

module.exports = ApartmentsProvider;
