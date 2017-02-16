import React, { Component } from 'react';

class CloudinaryImage extends Component {

  getSrcUrl() {
    let optionsStr = 'c_fit,f_auto,q_auto,e_improve';
    if (this.props.height) {
      optionsStr += ',h_' + this.props.height;
    }
    if (this.props.width) {
      optionsStr += ',w_' + this.props.width;
    }

    return optionsStr ? this.props.src.replace('upload', 'upload/' + optionsStr) : this.props.src;
  }

  render() {
    return (
      <img className={this.props.className} src={this.getSrcUrl()} />
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
