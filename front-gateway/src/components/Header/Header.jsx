import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import NavLink from '~/components/NavLink';

import './Header.scss';

class Header extends Component {
  render() {
    return (
      <Navbar className="header-navbar" collapseOnSelect fixedTop fluid inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" className="header-navbar-logo-anchor">
              <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg" alt="Dorbel" />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav bsStyle="pills">
          <NavItem eventKey={1} href="#">מי אנחנו</NavItem>
          <NavItem eventKey={2} href="#">צור קשר</NavItem>
        </Nav>
      </Navbar>

      // <div>
      //   <nav className="navbar navbar-default">
      //     <div className="container-fluid">
      //       <div className="navbar-header">
      //         <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
      //           <span className="sr-only">Toggle navigation</span>
      //           <span className="icon-bar"></span>
      //           <span className="icon-bar"></span>
      //           <span className="icon-bar"></span>
      //         </button>
      //         <NavLink className="navbar-brand" to="/">
      //           <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg" alt="Dorbel" />
      //           <h1 className="text-hide dorbel-logo">dorbel</h1>
      //         </NavLink>
      //       </div>
      //       <div id="navbar" className="navbar-collapse collapse">
      //         <form className="navbar-form navbar-left">
      //           <NavLink className="btn btn-success add-apartment-button" to="/apartments/new_form" >השכר נכס בבעלותך</NavLink>
      //         </form>
      //       </div>
      //     </div>
      //   </nav>
      // </div>
    );
  }
}

export default Header;



