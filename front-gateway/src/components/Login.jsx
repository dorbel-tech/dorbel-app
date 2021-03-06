'use strict';
import React, { PropTypes as T } from 'react';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

@inject('appStore', 'appProviders') @observer
export class Login extends React.Component {
  static hideFooter = true;

  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  componentDidMount() {
    const { appProviders, appStore } = this.props;
    const isLoggingIn = window.location.hash.indexOf('access_token') > -1;
    if (!appStore.authStore.isLoggedIn && !isLoggingIn) {
      appProviders.authProvider.showLoginModal({ onHideCallback: () => { history.back(); } });
    }
  }

  render() {
    return (
      <div className="loader-container">
        <LoadingSpinner />
      </div>
    );
  }
}

export default Login;
