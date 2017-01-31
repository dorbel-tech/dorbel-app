/**
 * This store should hold the values of the upload-apartment-form while it is being filled
 */
import _ from 'lodash';
import { observable, autorun } from 'mobx';
import autobind from 'react-autobind';
import localStorageHelper from './localStorageHelper';

const localStorageKey = 'newListingStoreState';

const roomOptions = _.range(1, 11, 0.5).map(num => ({ value: num, label: num }));

const defaultFormValues = {
  images: [],
  'apartment.building.city.id': 0, // we have to initialize this so Mobx will re-render the form when it changes
  publishing_user_type: 'landlord'
};

export default class NewListingStore {
  @observable formValues;
  @observable stepNumber = 0;

  constructor(authStore) {
    this.authStore = authStore;
    autobind(this);
    if (!this.attemptRestoreState()) {
      this.reset();
    }

    autorun(this.saveStore);
  }

  reset() {
    this.formValues = Object.assign({}, defaultFormValues);
    this.stepNumber = 0;
    if (process.env.IS_CLIENT) {
      localStorage.removeItem(localStorageKey);
    }
  }

  get roomOptions() {
    return roomOptions;
  }

  saveStore() {
    localStorageHelper.setItem(localStorageKey, this.toJson());
  }

  attemptRestoreState() {
    const previousState = localStorageHelper.getItem(localStorageKey);
    if (previousState) {
      Object.assign(this, previousState);
      return true;
    }
  }

  toJson() {
    return {
      formValues: this.formValues,
      stepNumber: this.stepNumber
    };
  }

}
