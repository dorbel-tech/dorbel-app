'use strict';
import React, { PropTypes as T } from 'react';
import { observer } from 'mobx-react';

@observer(['authProvider','appStore'])
export class Login extends React.Component {
  static propTypes = {
    authProvider: T.object,
    appStore: T.object
  }

  componentDidMount() {
    const { authProvider, appStore } = this.props;
    if (!appStore.authStore.isLoggedIn) authProvider.showLoginModal();
  }

  render() {
    const { appStore } = this.props;
    if (appStore.authStore.isLoggedIn) {
      return (
        <div>
          <h2>Already logged in</h2>
          <button onClick={appStore.authStore.logout}>Log out</button>
        </div>
      );
    } else {
      return <h2>Log in</h2>;
    }
  }
}

export default Login;
