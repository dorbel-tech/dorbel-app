'use strict';
import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject('appProviders')
class NavLink extends Component {

  constructor(props){
    super(props);
    this.routeTo = this.props.appProviders.navProvider.navigate;
  }

  render() {
    const to = this.props.to;
    return (
      <a href={to} onClick={(e) => this.routeTo(e, to)} className={this.props.className}>
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
