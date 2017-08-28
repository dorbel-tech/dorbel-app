import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';

import './AddressAutocomplete.scss'
class AddressAutocomplete extends Component {

  render() {
    return (
      <div>
        <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`} async></script>
        <Geosuggest country="IL" types={['address']} />
      </div>
    );
  }
}

export default AddressAutocomplete;
