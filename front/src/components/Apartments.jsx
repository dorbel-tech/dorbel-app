import React, { Component } from 'react';
import NavLink from './NavLink';

class Apartments extends Component {
  render() {
    return (
      <div>
        <h2>Apartments</h2>
        <ul>
          <li><NavLink to="/apartments/123">Nice Apartment</NavLink></li>
          <li><NavLink to="/apartments/456">Amazing Home</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

Apartments.propTypes = {
  children: React.PropTypes.node
};

export default Apartments;
