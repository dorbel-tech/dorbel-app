import React, { Component } from 'react';
import svgIcons from '~/assets/images/images.sprite.svg';

export default class Icon extends Component { 
  render() {
    const { iconName } = this.props;
    return <svg><use xlinkHref={svgIcons + '_' + iconName} /></svg>;
  }
}

Icon.propTypes = {
  iconName: React.PropTypes.string.isRequired
};
