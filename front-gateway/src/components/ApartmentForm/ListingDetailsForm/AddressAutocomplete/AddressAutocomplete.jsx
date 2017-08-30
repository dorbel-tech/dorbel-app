import React, { Component } from 'react';
import autobind from 'react-autobind';
import scriptLoader from 'react-async-script-loader'
import Geosuggest from 'react-geosuggest';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner'

import './AddressAutocomplete.scss'

const ISRAEL = ', ישראל';

@scriptLoader([`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`])
class AddressAutocomplete extends Component {
  constructor() {
    super();
    autobind(this)
    this.inputs = {};
  }

  parseStreetName(suggestion) {
    let streetName = suggestion.structured_formatting.main_text;

    const streetNameParts = streetName.split(' ')
    if (streetNameParts.length > 1) {
      if (parseInt(streetNameParts[streetNameParts.length - 1])) {
        streetName = streetNameParts.pop().join();
      }
    }

    return streetName;
  }

  parseCityName(suggestion) {
    return suggestion.structured_formatting.secondary_text.split(',')[0];
  }

  getSuggestLabel(suggestion) {
    const streetName = this.parseStreetName(suggestion);
    const cityName = this.parseCityName(suggestion)
    return `${streetName}, ${cityName}`;
  }

  onChange() {
    if (this.props.onAddressChange) {
      this.props.onAddressSelect({});
    }
  }

  // TODO: GeoCode call is redundant and should be canceled somehow
  onSuggestSelect(geoRes) {
    this.inputs.address.blur();
    if (this.props.onAddressSelect) {
      const geoResParts = geoRes.label.split(',').map(item => item.trim())
      this.props.onAddressSelect({
        cityName: geoResParts[0],
        streetName: geoResParts[1]
      });
    }
  }

  skipSuggest(suggestion) {
    return suggestion.types.indexOf('route') == -1
  }

  render() {
    const { isScriptLoadSucceed } = this.props
    return process.env.IS_CLIENT && isScriptLoadSucceed ?
      <Geosuggest
        ref={input => { this.inputs.address = input }}
        country="IL"
        types={['address']}
        placeholder="רחוב, עיר"
        autoActivateFirstSuggest
        getSuggestLabel={this.getSuggestLabel}
        onSuggestSelect={this.onSuggestSelect}
        skipSuggest={this.skipSuggest} />
      :
      <LoadingSpinner />;
  }
}

AddressAutocomplete.Props = {
  onAddressSelect: React.PropTypes.func
}

export default AddressAutocomplete;
