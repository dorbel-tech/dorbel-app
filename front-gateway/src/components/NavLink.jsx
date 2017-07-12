'use strict';
import React, { Component } from 'react';
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
  appProviders: React.PropTypes.object.isRequired,
  to: React.PropTypes.string,
  className: React.PropTypes.string,
  title: React.PropTypes.string,
  children: React.PropTypes.any
};

export default NavLink;
