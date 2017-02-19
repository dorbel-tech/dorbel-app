import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import './MapWrapper.scss';
import RadiusMarker from '../MapWrapper/Markers/RadiusMarker.jsx';


const options = {
  panControl: false,
  mapTypeControl: false,
  scrollwheel: false,
  disableDefaultUI: true,
  zoomControl: true,
};

class MapWrapper extends Component {

  constructor(props) {
    super(props);
    this.coords = {
      lng: props.geo.coordinates[0],
      lat: props.geo.coordinates[1]
    };
  }

  isTouchDevice() {
    return 'ontouchstart' in document.documentElement;
  }

  renderMap() {
    if (this.isTouchDevice()) {
      const positionStr = `${this.coords.lat},${this.coords.lng}`;
      const iconURL = 'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/radiusMarker/map-radius.png';
      return (
        <div className="map-image-container">
          <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${positionStr}&size=640x400&markers=anchor:center|icon:${iconURL}|${positionStr}&language=he&zoom=15&key=${process.env.GOOGLE_MAPS_API_KEY}`} />
        </div>
      );
    }
    else {
      return (
        <GoogleMap
          bootstrapURLKeys={{
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: 'he'
          }}
          options={options}
          defaultCenter={this.coords}
          defaultZoom={15}>

          <RadiusMarker {...this.coords} />
        </GoogleMap>
      );
    }
  }

  render() {
    if (process.env.IS_CLIENT) {
      return (
        <div className='mapWrapper'>
          {this.renderMap()}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

MapWrapper.propTypes = {
  geo: React.PropTypes.object,
};

export default MapWrapper;
