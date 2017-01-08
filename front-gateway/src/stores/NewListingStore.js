/**
 * This store should hold the values of the upload-apartment-form while it is being filled
 */
import _ from 'lodash';
import { observable } from 'mobx';

const roomOptions = _.range(1,11,0.5).map(num => ({value:num, label:num}));

const defaultFormValues = {
  images: [],
  'apartment.building.city.id': 0, // we have to initialize this so Mobx will re-render the form when it changes
  publishing_user_type: 'landlord'
};

export default class NewListingStore {
  @observable formValues;
  @observable stepNumber = 0;

  constructor() {
    this.formValues = Object.assign({}, defaultFormValues);    
  }

  get roomOptions() {
    return roomOptions;
  }

  toJson() {
    return {
      formValues: this.formValues
    };
  }

}
