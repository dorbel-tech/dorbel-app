import React, { Component } from 'react';
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
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  src: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
};

export default CloudinaryImage;
