'use strict';
import React, { PropTypes as T } from 'react';
import { inject, observer } from 'mobx-react';

@inject('appStore', 'appProviders') @observer
export class Login extends React.Component {
  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  componentDidMount() {
    const { appProviders, appStore } = this.props;
    const isLoggingIn = window.location.hash.indexOf('access_token') > -1;
    if (!appStore.authStore.isLoggedIn && !isLoggingIn) {
      appProviders.authProvider.showLoginModal(true);
    }
  }

  render() {
    const { appProviders, appStore } = this.props;
    if (appStore.authStore.isLoggedIn) {
      return (
        <div>
          <h3>כבר מחובר</h3>
          <button onClick={appProviders.authProvider.logout}>להתנתק</button>
        </div>
      );      
    } else {
      return <h3>מתחבר...</h3>;
    }
  }
}

export default Login;
