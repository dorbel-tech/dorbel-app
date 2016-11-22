/**
 * ApartmentsProvider communicates with the Apartments API
 */
'use strict';
import { action } from 'mobx';
import _ from 'lodash';
import moment from 'moment';

class ApartmentsProvider {
  constructor(appStore, apiProvider, cloudinaryProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.cloudinaryProvider = cloudinaryProvider;
  }

  loadApartments() {
    return this.apiProvider.fetch('/api/v1/listings')
      .then(action(apartments => this.appStore.apartmentStore.apartments = apartments));
  }

  // TODO : this is very form-specific , should mostly go to the form component (maybe)
  mapUploadApartmentFormToCreateListing(formValues) {
    let listing = _.pick(formValues, ['monthly_rent', 'lease_start', 'publishing_user_type']);
    listing.apartment = _.pick(formValues, ['apt_number', 'rooms', 'size', 'floor']);
    listing.apartment.building = _.pick(formValues, ['street_name', 'house_number', 'entrance', 'floors']); 
    listing.apartment.building.city = _.pick(formValues, ['city_name']);

    listing.images = formValues.images.map((cloudinaryImage, index) => ({
      url: cloudinaryImage.secure_url, display_order: index
    }));

    listing.open_house_events = [{ 
      start_time: this.setTimeFromString(formValues.ohe_date, formValues.ohe_start_time),
      end_time: this.setTimeFromString(formValues.ohe_date, formValues.ohe_end_time),
      comments: formValues.ohe_comments
    }];    

    return listing;
  }

  uploadApartment(formValues) {
    const listing = this.mapUploadApartmentFormToCreateListing(formValues);
    return this.apiProvider.fetch('/api/v1/listings', { method: 'POST', data: listing });
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
