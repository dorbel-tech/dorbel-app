/**
 * This store should hold the values of the upload-apartment-form while it is being filled
 */
import _ from 'lodash';
import { observable, autorun } from 'mobx';
import autobind from 'react-autobind';

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

    autorun(this.loadUserDetails);
    autorun(this.saveStore);
  }

  loadUserDetails() {
    if (this.authStore.profile) {
      const profile = this.authStore.profile;
      Object.assign(this.formValues, {
        'user.firstname': profile.first_name,
        'user.lastname': profile.last_name,
        'user.email': profile.email,
        'user.phone': profile.phone
      });
    } else if (this.formValues['user.email'] && !this.authStore.profile) {
      Object.assign(this.formValues, {
        'user.firstname': '',
        'user.lastname': '',
        'user.email': '',
        'user.phone': ''
      });
    }
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
    if (process.env.IS_CLIENT) {
      localStorage.setItem(localStorageKey, JSON.stringify(this.toJson()));
    }
  }

  attemptRestoreState() {
    if (process.env.IS_CLIENT) {
      const savedStore = localStorage.getItem(localStorageKey);
      if (savedStore) {
        try {
          const previousState = JSON.parse(savedStore);
          Object.assign(this, previousState);
          return true;
        }
        catch (ex) {
          // item localStorage is not good
          localStorage.removeItem(localStorageKey);
        }
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
