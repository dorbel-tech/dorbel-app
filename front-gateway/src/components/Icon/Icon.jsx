import React, { Component } from 'react';

// This is based on assets/images/images.sprite.svg being included in index.ejs

export default class Icon extends Component {
  render() {
    const { iconName } = this.props;
    return <svg width="41px" height="20px" className={this.props.className}><use xlinkHref={'#' + iconName} /></svg>;
  }
}

Icon.propTypes = {
  iconName: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
};
