import React, { Component, PropTypes as T } from 'react';
import { observer } from 'mobx-react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

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
    if (location) {
      location.href = href;
    }
  }

  routeTo(link) {
    if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }

  render() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;
    const isLoggedIn = authStore.isLoggedIn;
    const profile = authStore.profile || {};

    const firstName = profile.first_name || '';

    const externalURL = 'https://www.dorbel.com/pages/';

    return (
      <Navbar className="header-navbar" collapseOnSelect fixedTop fluid inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a onClick={() => this.routeTo('/')}
              className="header-navbar-logo-anchor">
              <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg"
                alt="Dorbel" />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav className="header-navbar-links">
            <NavItem onClick={this.redirect} href={externalURL + 'about_us'}>
              מי אנחנו</NavItem>
            <NavItem onClick={this.redirect} href={externalURL + 'owner'}>
              בעלי דירות</NavItem>
            <NavItem className="header-navbar-owner-services-navitem"
              onClick={this.redirect}
              href={externalURL + 'שירותים-לבעלי-דירות'}>שירותים לבעלי דירות</NavItem>
            <NavItem onClick={() => this.routeTo('/apartments')}
              href="/apartments">מצאו דירה</NavItem>
            <NavItem className="btnPublish" onClick={() => this.routeTo('/apartments/new_form')}
              href="/apartments/new_form">פרסמו דירה</NavItem>
          </Nav>
          {isLoggedIn ?
            <Nav pullLeft className="header-navbar-profile">
              <NavItem>
                <img src={profile.picture} className="header-navbar-profile-image" />
              </NavItem>
              <NavItem className="header-navbar-profile-text">{firstName}</NavItem>
              <NavItem onClick={authProvider.logout}
                className="header-navbar-profile-login-text">התנתק</NavItem>
            </Nav>
            :
            <Nav pullLeft className="header-navbar-profile">
              <NavItem onClick={authProvider.showLoginModal}
                className="header-navbar-profile-login-text">התחבר</NavItem>
            </Nav>
          }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.wrappedComponent.propTypes = {
  router: React.PropTypes.any
};

export default Header;
