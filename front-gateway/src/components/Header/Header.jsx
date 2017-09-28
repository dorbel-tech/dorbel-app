import React, { Component, PropTypes as T } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';

import isMobileJs from 'ismobilejs';
import UnreadMessagesNotifier from '~/components/Messaging/UnreadMessagesNotifier';
import UserProfileBadge from './UserProfileBadge/UserProfileBadge';
import { hideIntercom } from '~/providers/utils';
import { MENU_ITEMS } from '../Dashboard/DashboardShared';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { PROPERTY_SUBMIT_PREFIX } from '~/routesHelper';
import { SEARCH_PREFIX } from '~/routesHelper';

import './Header.scss';

@inject('appStore', 'appProviders') @observer
class Header extends Component {
  constructor(props) {
    super(props);
    this.handleHrefClick = this.props.appProviders.navProvider.handleHrefClick;
    autobind(this);
  }

  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  renderDashboardMenuItem(item) {
    const itemPath = '/dashboard/' + item.navTo;
    const isSelected = process.env.IS_CLIENT ? (location.pathname === itemPath) : false;

    return <NavItem key={'header-dashboard-menu-item-' + item.navTo}
      onClick={this.handleHrefClick}
      href={itemPath}
      className={'header-dashboard-menu-item' + (isSelected ? ' header-dashboard-menu-item-selected' : '')}>
      <i className={'header-dashboard-menu-item-icon fa ' + item.faIconClassName} aria-hidden="true"></i>
      {item.menuText}
    </NavItem>;
  }

  render() {
    const { authProvider } = this.props.appProviders;
    const { authStore } = this.props.appStore;
    const isLoggedIn = authStore.isLoggedIn;
    const isMobile = isMobileJs.phone;
    const externalURL = 'https://www.dorbel.com';
    const submitRoute = PROPERTY_SUBMIT_PREFIX;

    return (
      <Navbar className="header-navbar"
        collapseOnSelect fixedTop fluid inverse
        onToggle={hideIntercom}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href={externalURL}
              className="header-navbar-logo-anchor">
              <img src="https://static.dorbel.com/images/logo/dorbel_logo_white.svg"
                alt="Dorbel" className="header-logo-image" />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle>
            <UnreadMessagesNotifier />
            <span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
          </Navbar.Toggle>
        </Navbar.Header>
        <Navbar.Collapse>
          <UserProfileBadge />
          <Nav className="header-navbar-links">
            {MENU_ITEMS.map((item) => this.renderDashboardMenuItem(item))}
            {isMobile ?
              <NavItem className="header-navbar-btn-publish" onClick={this.handleHrefClick}
                href={submitRoute}>פרסמו דירה</NavItem>
              :
              null}
            {isMobile ?
              <NavItem onClick={this.handleHrefClick} href={SEARCH_PREFIX}>מצאו דירה</NavItem>
              :
              null}
            <NavItem onClick={this.handleHrefClick} href={externalURL + '/pages/owner'}>
              בעלי דירות
            </NavItem>
            <NavItem className="header-navbar-owner-services-navitem"
              onClick={this.handleHrefClick}
              href={externalURL + '/pages/services'}>
              שירותי פרימיום
            </NavItem>
            {isMobile ?
              null
              :
              <NavItem onClick={this.handleHrefClick} href={SEARCH_PREFIX}>מצאו דירה</NavItem>
            }
            {isMobile ?
              null
              :
              <NavItem className="header-navbar-btn-publish" onClick={this.handleHrefClick}
                href={submitRoute}>פרסמו דירה</NavItem>
            }
            {isLoggedIn ?
              <NavItem onClick={authProvider.logout}
                className="header-navbar-profile-login-text">
                <i className="fa fa-sign-out" />
                התנתק
              </NavItem>
              :
              <NavItem onClick={authProvider.showLoginModal}
                className="header-navbar-profile-login-text">
                <i className="fa fa-sign-in" />
                התחבר
              </NavItem>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
