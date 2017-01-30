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
        .then(listing => {
          listing.title = listing.title || `דירת ${listing.apartment.rooms} חד׳ ברח׳ ${listing.apartment.building.street_name}`;
          this.appStore.listingStore.listingsById.set(id, listing);
          this.appStore.metaData = _.defaults(this.getListingMetadata(listing), this.appStore.metaData);
        }),
      this.oheProvider.loadListingEvents(id),
      this.oheProvider.getFollowsForListing(id)
    ]);
  }

  getListingMetadata(listing) {
    return {
      description: listing.description,
      title: listing.title,
      image: (listing.images && listing.images.length > 0) ? listing.images[0].url : undefined,
      url: this.getCanonicalUrl(listing)
    };
  }

  getCanonicalUrl(listing) {
    let listingUrl = process.env.FRONT_GATEWAY_URL + '/apartments/' + listing.id;
    return (listing.slug) ?
      listingUrl + '-' + listing.slug : listingUrl;
  }

  uploadApartment(listing) {
    let createdListing;
    return this.apiProvider.fetch('/api/apartments/v1/listings', { method: 'POST', data: listing })
      .then((newListing) => createdListing = newListing)
      .then(() => this.oheProvider.createOhe(Object.assign({ listing_id: createdListing.id }, listing.open_house_event)))
      .then(() => this.appStore.authStore.updateProfile({
        first_name: listing.user.firstname,
        last_name: listing.user.lastname,
        phone: listing.user.phone,
        email: listing.user.email
      }))
      .then(() => { return createdListing; });
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
