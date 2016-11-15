/**
 * ApartmentsProvider communicates with the Apartments API
 */
'use strict';
import { action } from 'mobx';
import _ from 'lodash';
import moment from 'moment';

class ApartmentsProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  @action
  loadApartments() {
    return this.apiProvider.fetch('/api/v1/listings')
      .then(apartments => this.appStore.apartmentStore.apartments = apartments);
  }

  // TODO : this is very form-specific , should mostly go to the form component (maybe)
  mapUploadApartmentFormToCreateListing(formValues) {
    let listing = _.pick(formValues, ['monthly_rent', 'lease_start']);
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

    listing.publishing_user_type = formValues.publishing_user_type_tenant ? 'tenant' : 'landlord';    

    return listing;
  }

  uploadApartment(formValues) {
    const listing = this.mapUploadApartmentFormToCreateListing(formValues);
    return this.apiProvider.fetch('/api/v1/listings', { method: 'POST', data: listing });
  }

  setTimeFromString(dateString, timeString) {
    return moment(dateString + 'T' + timeString).toJSON();    
  }
}

module.exports = ApartmentsProvider;
