/**
 * ApartmentsProvider communicates with the Apartments API
 */
'use strict';
import { action } from 'mobx';
import _ from 'lodash';

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
    listing.lease_start = listing.lease_start.toJSON().substr(0,10); // just date format

    return listing;
  }

  uploadApartment(formValues) {
    const listing = this.mapUploadApartmentFormToCreateListing(formValues);
    return this.apiProvider.fetch('/api/v1/listings', { method: 'POST', data: listing });
  }

  setTimeFromString(date, timeString) {
    const dateObj = new Date(date.getTime()); // i.e. cloning date
    var timeSplit = timeString.split(':').map(s => parseInt(s));
    dateObj.setHours(timeSplit[0]); 
    dateObj.setMinutes(timeSplit[1]);
    return dateObj;
  }
}

module.exports = ApartmentsProvider;
