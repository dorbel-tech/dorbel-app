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

  toJson() {
    return {
      formValues: this.formValues,
      stepNumber: this.stepNumber
    };
  }

}
