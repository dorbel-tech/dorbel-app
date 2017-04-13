/**
 * This store should hold the values of a listing being created (uploaded) or edited
 */
import _ from 'lodash';
import { observable, autorun } from 'mobx';
import autobind from 'react-autobind';
import localStorageHelper from './localStorageHelper';

const roomOptions = _.range(1, 11, 0.5).map(num => ({ value: num, label: num }));

const defaultFormValues = {
  images: [],
  'apartment.building.city.id': 1, // we have to initialize this so Mobx will re-render the form when it changes
  publishing_user_type: 'landlord'
};

export default class EditedListingStore {
  @observable formValues;
  @observable stepNumber = 0;

  constructor(authStore, options) {
    this.authStore = authStore;
    this.options = options || {};
    this.allowedKeys = {};
    autobind(this);
    if (!this.attemptRestoreState()) {
      this.reset();
    }

    autorun(this.saveStore);
    authStore.events.on('logout', this.reset);
  }

  reset() {
    this.formValues = Object.assign({}, defaultFormValues);
    this.stepNumber = 0;
    if (process.env.IS_CLIENT && this.options.localStorageKey) {
      localStorage.removeItem(this.options.localStorageKey);
    }
  }

  get roomOptions() {
    return roomOptions;
  }

  updateFormValues(newFormValues) {
    this.formValues = Object.assign(this.formValues, newFormValues);
    this.saveStore();
  }

  saveStore() {
    if (this.options.localStorageKey) {
      localStorageHelper.setItem(this.options.localStorageKey, this.toJson());
    }
  }

  attemptRestoreState() {
    if (this.options.localStorageKey) {
      const previousState = localStorageHelper.getItem(this.options.localStorageKey);
      if (previousState) {
        Object.assign(this, previousState);
        return true;
      }
    }
  }

  toListingObject() {
    const formValues = this.formValues;
    const listing = {};
    // this is so we can use nested structure in our form attributes
    Object.keys(formValues)
      .filter(key => formValues.hasOwnProperty(key) && this.allowedKeys[key])
      .forEach(key => _.set(listing, key, formValues[key]));

    listing.images = formValues.images.map((image, index) => ({
      url: image.secure_url || image.src, display_order: index
    }));

    return listing;
  }

  fillFromListing(listing) {
    var newFormValues = {};

    // adapted from http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects but ignoring arrays
    function recurse (value, fieldName) {
      if (Object(value) !== value && value !== null) {
        newFormValues[fieldName] = value;
      } else if (Array.isArray(value)) {
        // ignoring arrays
      } else {
        for (var p in value) {
          recurse(value[p], fieldName ? fieldName + '.' + p : p);
        }
      }
    }
    recurse(listing, '');

    newFormValues.images = listing.images.map(image => ({ src: image.url, complete: true }));

    this.updateFormValues(newFormValues);
  }

  registerKeys(keys) {
    keys.forEach(key => this.allowedKeys[key] = true);
  }

  toJson() {
    return {
      formValues: this.formValues,
      stepNumber: this.stepNumber
    };
  }

}
