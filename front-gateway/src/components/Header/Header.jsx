import React, { Component } from 'react';
import './Header.scss';
import NavLink from '~/components/NavLink';

class Header extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <NavLink className="navbar-brand" to="/">
                  <h1 className="text-hide dorbel-logo">dorbel</h1>                  
                </NavLink>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
                <form className="navbar-form navbar-left">
                  <NavLink className="btn btn-success add-apartment-button" to="/apartments/new_form" >השכר נכס בבעלותך</NavLink>
                </form>
            </div>
          </div>
        </nav>        
      </div>
    );
  }
}

export default Header;



