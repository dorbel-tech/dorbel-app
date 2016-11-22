/**
 * This store should hold the values of the upload-apartment-form while it is being filled
 */
import _ from 'lodash';
import { observable } from 'mobx';

const hours = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'
];

const roomOptions = _.range(1,11,0.5).map(num => ({value:num, label:num}));

const defaultFormValues = {
  images: [],
  ohe_start_time: hours[0],
  ohe_end_time: hours[1]
};

export default class NewListingStore {
  @observable formValues = defaultFormValues;
  @observable stepNumber = 0;

  get hours() {
    return hours;
  }

  get endHours() {
    return hours.slice(hours.indexOf(this.formValues.ohe_start_time) + 1);
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
