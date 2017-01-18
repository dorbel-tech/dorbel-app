import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import './LoadingSpinner.scss';

class LoadingSpinner extends Component {

  render() {
    let style = {};
    if (this.props.size){
      style.height = this.props.size+'px';
      style.width = this.props.size+'px';
    }
    return (
        <Spinner spinnerName="circle" style={style} noFadeIn />
    );
  }
}

LoadingSpinner.propTypes = {
  size: React.PropTypes.number
};

export default LoadingSpinner;
