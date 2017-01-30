'use strict';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer(['router'])
class NavLink extends Component {
  render() {
    const to = this.props.to;
    return (
      <a href={to} onClick={(event) => this.routeTo(event, to)} className={this.props.className}>
        {this.props.children}
      </a>
    );
  }

  routeTo(event, link) {
    if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
      event.preventDefault(); // cancel the event so we don't get a reload
      return false;
    }
  }
}

NavLink.wrappedComponent.propTypes = {
  to: React.PropTypes.string,
  router: React.PropTypes.any,
  className: React.PropTypes.string,
  children: React.PropTypes.any
};

export default NavLink;
