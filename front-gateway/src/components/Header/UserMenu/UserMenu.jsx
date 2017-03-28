import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem } from 'react-bootstrap';

import './UserMenu.scss';

@observer(['appProviders', 'appStore'])
class UserMenu_dev extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMenu: false
    };
  }


  handleHover(isVisible) {
    this.setState({ displayMenu: isVisible });
  }

  render() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;
    const profile = authStore.profile || {};

    const isLoggedIn = authStore.isLoggedIn;

    return (
      isLoggedIn ?
        <div className="header-navbar-profile" onMouseEnter={() => { this.handleHover(true); }} onMouseLeave={() => { this.handleHover(false); }}>
          <div className="header-navbar-profile-details">
            <i className="fa fa-ellipsis-v header-navbar-profile-ellipsis-icon" />
            <img src={profile.picture} className="header-navbar-profile-image" />
            <div className="header-navbar-profile-name">
              <span>{profile.first_name ? profile.first_name : 'ברוכים'}</span>
              <span>{profile.first_name ? profile.last_name : 'הבאים'}</span>
            </div>
          </div>
          <div className={'header-navbar-menu-desktop ' + (this.state.displayMenu ? 'active' : '')}>
            <div className="triangle-up" />
            <Nav>
              <NavItem
                onClick={authProvider.logout}
                className="header-navbar-profile-logout-text">
                <i className="fa fa-sign-out" />
                התנתק
              </NavItem>
            </Nav>
          </div>
          <Nav className="header-navbar-menu-mobile">
            <NavItem
              className="header-navbar-profile-logout-text"
              onClick={authProvider.logout}>
              התנתק
           </NavItem>
          </Nav>
        </div >
        :
        <Nav className="header-navbar-profile" >
          <NavItem onClick={authProvider.showLoginModal}
            className="header-navbar-profile-login-text">התחבר</NavItem>
        </Nav >

    );
  }
}

UserMenu_dev.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UserMenu_dev;
