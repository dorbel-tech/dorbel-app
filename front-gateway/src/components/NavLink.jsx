'use strict';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer(['router'])
class NavLink extends Component {
  render() {
    const to = this.props.to;
    return (
      <a href="#" onClick={() => this.routeTo(to)}>
        {this.props.children}
      </a>
    );
  }

  routeTo(link) {
    if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }
}

NavLink.wrappedComponent.propTypes = {
  to: React.PropTypes.string,
  router: React.PropTypes.any,
  children: React.PropTypes.any
};

export default NavLink;
