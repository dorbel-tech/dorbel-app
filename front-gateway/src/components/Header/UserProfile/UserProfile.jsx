import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem } from 'react-bootstrap';

import './UserProfile.scss';

@observer(['appProviders', 'appStore'])
class UserProfile extends Component {
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
        <div className="user-profile" onMouseEnter={() => { this.handleHover(true); }} onMouseLeave={() => { this.handleHover(false); }}>
          <div className="user-profile-details">
            <i className="fa fa-ellipsis-v user-profile-ellipsis-icon" />
            <img src={profile.picture} className="user-profile-image" />
            <div className="user-profile-name">
              <span>{profile.first_name ? profile.first_name : 'ברוכים'}</span>
              <span>{profile.first_name ? profile.last_name : 'הבאים'}</span>
            </div>
          </div>
          <div className={'header-navbar-menu-desktop ' + (this.state.displayMenu ? 'active' : '')}>
            <div className="triangle-up" />
            <Nav>
              <NavItem
                onClick={authProvider.logout}
                className="user-profile-logout-text">
                <i className="fa fa-sign-out" />
                התנתק
              </NavItem>
            </Nav>
          </div>
          <Nav className="header-navbar-menu-mobile">
            <NavItem
              className="user-profile-logout-text"
              onClick={authProvider.logout}>
              התנתק
           </NavItem>
          </Nav>
        </div >
        :
        <Nav className="user-profile" >
          <NavItem onClick={authProvider.showLoginModal}
            className="user-profile-login-text">התחבר</NavItem>
        </Nav >

    );
  }
}

UserProfile.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UserProfile;
