/**
 * This store should hold the values of a listing being created (uploaded) or edited
 */
import _ from 'lodash';
import { observable, computed, autorun, extendObservable } from 'mobx';
import autobind from 'react-autobind';
import localStorageHelper from './localStorageHelper';
import FlatListing from './models/FlatListing';

const roomOptions = _.range(1, 11, 0.5).map(num => ({ value: num, label: num }));

export default class EditedListingStore {
  @observable uploadMode;
  @observable formValues;
  @observable stepNumber = 0;
  @observable isFromValid = true;

  @computed get shouldDisableSave() {
    const images = this.formValues.images;
    if (this.uploadMode !== 'manage') {
      return images.length === 0 || images.some(img => !img.complete);
    }

    return false;
  }

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
    this.isFromValid = true;

    if (process.env.IS_CLIENT && this.options.localStorageKey) {
      localStorage.removeItem(this.options.localStorageKey);
    }
  }

  set isFromValid(value) {
    this.isFromValid = value;
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

    listing.images = formValues.images.map((image) => ({
      url: image.secure_url || image.src,
      display_order: image.display_order
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
