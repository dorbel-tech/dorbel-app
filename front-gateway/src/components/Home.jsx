import React, { Component } from 'react';
import NavLink from '~/components/NavLink';

class Home extends Component {
  render() {
    return (
      <div>
        <NavLink to="/"><h1>dorbel</h1></NavLink>
        <ul role="nav">
          <li><NavLink to="/apartments">Apartments</NavLink></li>
          <li><NavLink to="/apartments/new_form">Add New Apartment</NavLink></li>
          <li><NavLink to="/login">Login</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default Home;
