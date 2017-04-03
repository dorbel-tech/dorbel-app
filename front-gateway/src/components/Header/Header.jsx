import React, { Component, PropTypes as T } from 'react';
import { observer } from 'mobx-react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import UserProfileBadge from './UserProfileBadge/UserProfileBadge';

import './Header.scss';

@observer(['appProviders', 'appStore', 'router'])
class Header extends Component {
  constructor(props) {
    super(props);

    this.redirect = this.redirect.bind(this);
  }

  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  redirect(e) {
    const href = e.target.href;
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(href);
    } else if (location) {
      location.href = href;
    }
  }

  routeTo(e, link) {
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(link);
    } else if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }

  // Ugly patch to close Bootstrap Navbar when clicked outside mobile menu area.
  mobileMenuHandleClickOutside(e) {
    const mobileMenu = document.getElementsByClassName('navbar-collapse')[0];
    const mobileMenuIsOpen = document.getElementsByClassName('navbar-collapse collapse in')[0];
    const mobileMenuToggle = document.getElementsByClassName('navbar-toggle')[0];

    if(!mobileMenu.contains(e.target) && mobileMenuIsOpen) {
      mobileMenuToggle.click();
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.mobileMenuHandleClickOutside.bind(this));      
  }
   
  componentWillUnmount() {
    window.removeEventListener('click', this.mobileMenuHandleClickOutside.bind(this));
  } 

  render() {

    const externalURL = 'https://www.dorbel.com';

    return (
      <Navbar className="header-navbar" collapseOnSelect fixedTop fluid inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href={externalURL}
              className="header-navbar-logo-anchor">
              <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg"
                alt="Dorbel" className="header-logo-image"/>
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav className="header-navbar-links">
            <NavItem onClick={this.redirect} href={externalURL + '/pages/about_us'}>
              מי אנחנו</NavItem>
            <NavItem onClick={this.redirect} href={externalURL + '/pages/owner'}>
              בעלי דירות</NavItem>
            <NavItem className="header-navbar-owner-services-navitem"
              onClick={this.redirect}
              href={externalURL + '/pages/services'}>שירותי פרימיום</NavItem>
            <NavItem onClick={(e) => this.routeTo(e, '/apartments')}
              href="/apartments">מצאו דירה</NavItem>
            <NavItem className="btn-publish" onClick={(e) => this.routeTo(e, '/apartments/new_form')}
              href="/apartments/new_form">פרסמו דירה</NavItem>
          </Nav>
          <UserProfileBadge />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.wrappedComponent.propTypes = {
  router: React.PropTypes.any
};

export default Header;
