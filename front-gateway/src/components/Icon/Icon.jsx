import React, { Component } from 'react';
import svgIcons from '~/assets/images/images.sprite.svg';

export default class Icon extends Component { 
  render() {
    const { iconName } = this.props;
    return <svg width="41px" height="20px" className={this.props.className}><use xlinkHref={svgIcons + '_' + iconName} /></svg>;
  }
}

Icon.propTypes = {
  iconName: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
};
