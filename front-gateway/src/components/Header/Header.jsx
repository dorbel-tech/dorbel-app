import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import './Header.scss';

@observer(['router'])
class Header extends Component {
  routeTo(link) {
    if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }

  render() {
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
            <NavItem eventKey={1} onClick={() => this.routeTo('https://www.dorbel.com/pages/about_us')}
              href="https://www.dorbel.com/pages/about_us">מי אנחנו</NavItem>
            <NavItem eventKey={2} onClick={() => this.routeTo('https://www.dorbel.com/pages/owner')}
              href="https://www.dorbel.com/pages/owner">בעלי דירות</NavItem>
            <NavItem eventKey={3} onClick={() => this.routeTo('https://www.dorbel.com/pages/שירותים-לבעלי-דירות')}
              href="https://www.dorbel.com/pages/שירותים-לבעלי-דירות">שירותים לבעלי דירות</NavItem>
            <NavItem eventKey={4} onClick={() => this.routeTo('/apartments')}
              href="/apartments">מצאו דירה</NavItem>
            <NavItem eventKey={5} onClick={() => this.routeTo('/apartments/new_form')}
              href="/apartments/new_form">פרסמו דירה</NavItem>
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



