import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import _ from 'lodash';

const amenitiesLeft = [
  { path: 'apartment.building.elevator', icon: 'lift', label: 'מעלית' },
  { path: 'apartment.security_bars', icon: 'bars', label: 'סורגים בחלונות' },
  { path: 'apartment.pets', icon: 'dog', label: 'בע״ח: מותר' },
  { path: 'apartment.parquet_floor', icon: 'parquet', label: 'פרקט' },
  { path: 'roommates', icon: 'roommates', label: 'מתאימה לשותפים' }
];

const amenitiesRight = [
  { path: 'apartment.parking', icon: 'parking', label: 'חנייה' },
  { path: 'apartment.air_conditioning', icon: 'ac', label: 'מזגן' },
  { path: 'apartment.sun_heated_boiler', icon: 'solar', label: 'דוד שמש' },
  { path: 'apartment.balcony', icon: 'balcony', label: 'מרפסת' }
];

export default class ListingAmenities extends Component {
  renderAmentites(amenities, listing, xsCols) {
    const amenityList = amenities
      .filter(amenity => _.get(listing, amenity.path))
      .map((amenity, index) => (<li key={index}><img src={'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/amenities/icon-' + amenity.icon + '.svg'} />{amenity.label}</li>));

    return (
      <Col sm={5} xs={xsCols} className="listing-amenities-col">
        <ul>
          {amenityList}
        </ul>
      </Col>
    );
  }

  render() {
    const { listing } = this.props;

    return (
      <Col className="listing-amenities">
        <Col sm={2}>
          <h5>פרטי הנכס</h5>
        </Col>
        {this.renderAmentites(amenitiesLeft, listing, 7)}
        {this.renderAmentites(amenitiesRight, listing, 5)}
      </Col>
    );
  }
}

ListingAmenities.propTypes = {
  listing: React.PropTypes.object.isRequired
};
