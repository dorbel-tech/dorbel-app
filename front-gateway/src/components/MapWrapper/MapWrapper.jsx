import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import './MapWrapper.scss';
import RadiusMarker from '../MapWrapper/Markers/RadiusMarker.jsx';


const options = {
  panControl: false,
  mapTypeControl: false,
  scrollwheel: false,
  disableDefaultUI: true,
  zoomControl: true
};

class MapWrapper extends Component {

  constructor(props) {
    super(props);
    this.coords = {
      lng: props.geo.coordinates[0],
      lat: props.geo.coordinates[1]
    };
  }

  render() {
    return (
      <div className='mapWrapper'>
        <GoogleMap
          bootstrapURLKeys={{
            key: window.dorbelConfig.GOOGLE_MAPS_API_KEY,
            language: 'he'
          }}
          options={options}
          defaultCenter={this.coords}
          defaultZoom={15}>

          <RadiusMarker {...this.coords} />
        </GoogleMap>
      </div>
    );
  }
}

MapWrapper.propTypes = {
  geo: React.PropTypes.object,
};

export default MapWrapper;
