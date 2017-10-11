'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

@inject('appProviders')
class NavLink extends Component {
  render() {
    const to = this.props.to;
    const { handleHrefClick } = this.props.appProviders.navProvider;

    return (
      <a href={to} onClick={handleHrefClick} className={this.props.className} title={this.props.title}>
        {this.props.children}
      </a>
    );
  }
}

NavLink.wrappedComponent.propTypes = {
  appProviders: PropTypes.object.isRequired,
  to: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any
};

export default NavLink;
