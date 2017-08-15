'use strict';
/**
 * The FlatListing class holds the values for
 * 1. New listings that are being POSTed
 * 2. Listings that are being edited and PATCHed
 **/
import _ from 'lodash';
import { observable } from 'mobx';


export default class FlatListing {
  constructor(listing) {
    if (listing) {
      VALID_KEYS.filter(key => !!_.get(listing, key)).forEach(key => this[key] = _.get(listing, key));
      this.images = observable((listing.images || []).map(image => {
        return { src: image.url, complete: true, display_order: image.display_order };
      }));
    } else {
      Object.assign(this, defaultFormValues);
    }
  }
}

const defaultFormValues = {
  @observable images: [],
  publishing_user_type: 'landlord'
};

const VALID_KEYS = [
  // listing
  'publishing_user_type',
  'lease_start',
  'lease_end',
  'description',
  'roommates',
  'roommate_needed',
  'monthly_rent',
  'property_tax',
  'board_fee',
  'directions',
  'show_phone',
  'status',
  // apartment
  'apartment.apt_number',
  'apartment.building.entrance',
  'apartment.floor',
  'apartment.building.floors',
  'apartment.size',
  'apartment.rooms',
  'apartment.parking',
  'apartment.building.elevator',
  'apartment.sun_heated_boiler',
  'apartment.pets',
  'apartment.air_conditioning',
  'apartment.balcony',
  'apartment.security_bars',
  'apartment.parquet_floor',
  // building
  'apartment.building.street_name',
  'apartment.building.house_number',
  // city
  'apartment.building.city.id',
  // neighborhood
  'apartment.building.neighborhood.id',
  // user details
  'user.firstname',
  'user.lastname',
  'user.email',
  'user.phone',
];
