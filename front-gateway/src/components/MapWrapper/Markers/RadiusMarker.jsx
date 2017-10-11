import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  lat: PropTypes.number,
  lng: PropTypes.number
};

export default RadiusMarker;
