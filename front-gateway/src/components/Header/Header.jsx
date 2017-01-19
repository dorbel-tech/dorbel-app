import React, { Component, PropTypes as T } from 'react';
import { observer } from 'mobx-react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import './Header.scss';

@observer(['appProviders', 'appStore', 'router'])
class Header extends Component {
  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  routeTo(link) {
    if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }

  render() {
    const { appProviders, appStore } = this.props;
    const isLoggedIn = appStore.authStore.isLoggedIn ||
      window.location.hash.indexOf('access_token') > -1;

    const firstName = isLoggedIn ? appStore.authStore.getProfile().first_name : '';

    return (
      <Navbar className="header-navbar" collapseOnSelect fixedTop fluid inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" className="header-navbar-logo-anchor">
              <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/logo/dorbel_logo_white.svg" alt="Dorbel" />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem onClick={() => this.routeTo('https://www.dorbel.com/pages/about_us')}
              href="https://www.dorbel.com/pages/about_us">מי אנחנו</NavItem>
            <NavItem onClick={() => this.routeTo('https://www.dorbel.com/pages/owner')}
              href="https://www.dorbel.com/pages/owner">בעלי דירות</NavItem>
            <NavItem onClick={() => this.routeTo('https://www.dorbel.com/pages/שירותים-לבעלי-דירות')}
              href="https://www.dorbel.com/pages/שירותים-לבעלי-דירות">שירותים לבעלי דירות</NavItem>
            <NavItem onClick={() => this.routeTo('/apartments')}
              href="/apartments">מצאו דירה</NavItem>
            <NavItem onClick={() => this.routeTo('/apartments/new_form')}
              href="/apartments/new_form">פרסמו דירה</NavItem>
          </Nav>
          <Nav pullLeft>
            <NavItem>{ firstName }</NavItem>
            {isLoggedIn ?
              <NavItem onClick={appProviders.authProvider.logout}>התנתק</NavItem>
              :
              <NavItem onClick={appProviders.authProvider.showLoginModal}>התחבר</NavItem>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.wrappedComponent.propTypes = {
  router: React.PropTypes.any
};

export default Header;



