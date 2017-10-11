import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from '~/providers/utils';

class CloudinaryImage extends Component {

  render() {
    const imageUrl = utils.optimizeCloudinaryUrl(this.props.src, this.props.width, this.props.height);
    return (
      <img className={this.props.className} src={imageUrl} />
    );
  }
}

CloudinaryImage.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  src: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default CloudinaryImage;
