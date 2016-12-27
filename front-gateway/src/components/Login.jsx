'use strict';
import React, { PropTypes as T } from 'react';
import { observer } from 'mobx-react';

@observer(['appProviders','appStore'])
export class Login extends React.Component {
  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  componentDidMount() {
    const { appProviders, appStore } = this.props;
    const isLoggingIn = window.location.hash.indexOf('access_token') > -1;
    if (!appStore.authStore.isLoggedIn && !isLoggingIn) {
      appProviders.authProvider.showLoginModal();
    }
  }

  render() {
    const { appProviders, appStore } = this.props;
    if (appStore.authStore.isLoggedIn) {
      return (
        <div>
          <h2>Already logged in</h2>
          <button onClick={appProviders.authProvider.logout}>Log out</button>
        </div>
      );
    } else {
      return <h2>Log in</h2>;
    }
  }
}

export default Login;
