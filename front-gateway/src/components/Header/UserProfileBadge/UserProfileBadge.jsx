import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Nav, NavItem } from 'react-bootstrap';
import { MENU_ITEMS } from '../../Dashboard/DashboardShared';

import UnreadMessagesNotifier from '~/components/Messaging/UnreadMessagesNotifier';

import './UserProfileBadge.scss';

@inject('appStore', 'appProviders') @observer
class UserProfileBadge extends Component {
  constructor(props) {
    super(props);
    this.handleHrefClick = this.props.appProviders.navProvider.handleHrefClick;
    this.state = {
      displayMenu: false
    };
  }

  renderDashboardMenuItem(item) {
    const itemPath = '/dashboard/' + item.navTo;

    return (
      <NavItem key={'header-profile-menu-item-' + item.navTo}
        onClick={this.handleHrefClick}
        href={itemPath}
        className="header-profile-menu-item">
        <i className={'fa ' + item.faIconClassName} aria-hidden="true"></i>
        {item.menuText}
      </NavItem>
    );
  }

  renderMenu(isLoggedIn) {
    const { authProvider } = this.props.appProviders;

    return (
      <Nav>
        {MENU_ITEMS.map((item) => this.renderDashboardMenuItem(item))}
        <NavItem
          onClick={isLoggedIn ? authProvider.logout : authProvider.showLoginModal}
          className={'user-profile-badge-auth' + (isLoggedIn ? ' user-profile-badge-auth-logout' : '')}>
          <i className={isLoggedIn ? 'fa fa-sign-out' : 'fa fa-sign-in'} />
          {isLoggedIn ? 'התנתק' : 'התחבר'}
        </NavItem>
      </Nav>
    );
  }

  renderPersonalData(isLoggedIn) {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;

    const profile = authStore.profile || {};

    return isLoggedIn ?
      (
        <div className="user-profile-badge-details">
          <i className="fa fa-ellipsis-v user-profile-badge-ellipsis-icon" />
          <img src={profile.picture} className="user-profile-badge-image" />
          <UnreadMessagesNotifier />
          <div className="user-profile-badge-name">
            <span>{profile.first_name ? profile.first_name : 'ברוכים'}</span>
            <span>{profile.first_name ? profile.last_name : 'הבאים'}</span>
          </div>
        </div>
      ) :
      (
        <div className="user-profile-badge-details">
          <i className="fa fa-ellipsis-v user-profile-badge-ellipsis-icon" />
          <div className="user-profile-badge-anonymous-icon-wrapper">
            <div className="user-profile-badge-anonymous-icon">
              <i className="fa fa-user" />
            </div>
          </div>
          <div className="user-profile-badge-auth-inline">
            <Nav>
              <NavItem
                onClick={authProvider.showLoginModal}
                className="user-profile-badge-auth">
                <i className="fa fa-sign-in" />
                התחבר
              </NavItem>
            </Nav>
          </div>
        </div>
      );
  }

  handleHover(isVisible) {
    this.setState({ displayMenu: isVisible });
  }

  render() {
    const { authStore } = this.props.appStore;
    const isLoggedIn = authStore.isLoggedIn;

    return (
      <div className="user-profile-badge" onMouseEnter={() => { this.handleHover(true); }} onMouseLeave={() => { this.handleHover(false); }}>
        {this.renderPersonalData(isLoggedIn)}
        <div className={'user-profile-badge-menu-desktop' + (this.state.displayMenu ? ' active' : '')}>
          <div className="triangle-up" />
          {this.renderMenu(isLoggedIn)}
        </div>
        <div className="user-profile-badge-menu-mobile">
          {this.renderMenu(isLoggedIn)}
        </div>
      </div>
    );
  }
}

UserProfileBadge.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object
};

export default UserProfileBadge;
