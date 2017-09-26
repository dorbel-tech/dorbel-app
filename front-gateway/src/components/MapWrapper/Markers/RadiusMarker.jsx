import React, { Component } from 'react';
import './RadiusMarker.scss';

class RadiusMarker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='radiusMarker'></div>
    );
  }
}

RadiusMarker.propTypes = {
  lat: React.PropTypes.number,
  lng: React.PropTypes.number
};

export default RadiusMarker;
