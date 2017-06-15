/**
 * This store should hold the values of a listing being created (uploaded) or edited
 */
import _ from 'lodash';
import { observable, autorun, extendObservable } from 'mobx';
import autobind from 'react-autobind';
import localStorageHelper from './localStorageHelper';
import FlatListing from './models/FlatListing';

const roomOptions = _.range(1, 11, 0.5).map(num => ({ value: num, label: num }));

export default class EditedListingStore {
  @observable uploadMode;
  @observable formValues;
  @observable stepNumber = 0;
  @observable disableSave = false;
  @observable uploadedImagesCount = 0;
  @observable isListingDetailsFromValid = true;

  constructor(authStore, options) {
    this.authStore = authStore;
    this.options = options || {};
    autobind(this);
    if (!this.attemptRestoreState()) {
      this.reset();
    }

    autorun(this.saveStore);
    authStore.events.on('logout', this.reset);
  }

  reset() {
    this.formValues = new FlatListing();
    this.stepNumber = 0;
    this.disableSave = false;
    this.uploadedImagesCount = 0;
    this.isListingDetailsFromValid = true;

    if (process.env.IS_CLIENT && this.options.localStorageKey) {
      localStorage.removeItem(this.options.localStorageKey);
    }
  }

  set disableSave(value) {
    this.disableSave = value;
  }

  set uploadedImagesCount(value) {
    this.uploadedImagesCount = value;
  }

  set isListingDetailsFromValid(value) {
    this.isListingDetailsFromValid = value;
  }

  get roomOptions() {
    return roomOptions;
  }

  updateFormValues(newFormValues) {
    extendObservable(this.formValues, newFormValues);
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
      .filter(key => formValues.hasOwnProperty(key))
      .forEach(key => _.set(listing, key, formValues[key]));

    listing.images = formValues.images.map((image, index) => ({
      url: image.secure_url || image.src, display_order: index
    }));

    return listing;
  }

  loadListing(listing) {
    const newFormValues = new FlatListing(listing);
    this.updateFormValues(newFormValues);
  }

  toJson() {
    return {
      uploadMode: this.uploadMode,
      formValues: this.formValues,
      stepNumber: this.stepNumber
    };
  }
}
