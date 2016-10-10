import { observable, action } from 'mobx';

export default class ApartmentStore {
  @observable apartments;

  constructor(initialState) {
    if (initialState && initialState.apartmentStore && initialState.apartmentStore.apartments) {
      this.apartments = initialState.apartmentStore.apartments;
    }
    else this.apartments = [];
  }

  @action
  loadApartments() {
    console.log('loading apartments');
    if (this.apartments.length > 0) return;
    fetch('https://app.dorbel.com/apartments.json?search=1&empty=false&roommates=true&min_rooms=1&max_rooms=5&min_rent=0&max_rent=12000&min_size=0&max_size=140&city_id=0&data=%7B%22amenities%22%3A%5B%5D%7D')
      .then(response => response.json())
      .then(response => {
        console.log('got apartments', response.apartments);
        this.apartments = response.apartments;
      });
  }

  toJson() {
    return {
      apartments: this.apartments
    };
  }

}
