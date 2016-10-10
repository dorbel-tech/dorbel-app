import React, { Component } from 'react';
import { Link } from 'react-router';

class NavLink extends Component {
  render() {
    return <Link {...this.props} activeStyle={{ 'backgroundColor': '#DDDDDD' }}/>;
  }
}

export default NavLink;
