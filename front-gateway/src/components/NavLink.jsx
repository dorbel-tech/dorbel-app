'use strict';
import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject('appProviders')
class NavLink extends Component {
  constructor(props){
    super(props);
    this.handleHrefClick = this.props.appProviders.navProvider.handleHrefClick;
  }

  render() {
    const to = this.props.to;
    return (
      <a href={to} onClick={this.handleHrefClick} className={this.props.className}>
        {this.props.children}
      </a>
    );
  }
}

NavLink.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  to: React.PropTypes.string,
  className: React.PropTypes.string,
  children: React.PropTypes.any
};

export default NavLink;
