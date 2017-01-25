import React, { Component } from 'react';
import NavLink from '~/components/NavLink';

class Home extends Component {
  render() {
    return (
      <div>
        <ul role="nav">
          <li><NavLink to="/apartments">Apartments</NavLink></li>
          <li><NavLink to="/apartments/new_form">Add New Apartment</NavLink></li>
          <li><NavLink className="login-link" to="/login">Login</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default Home;
