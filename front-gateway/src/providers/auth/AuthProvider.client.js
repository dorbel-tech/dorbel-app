'use strict';
import promisify from 'es6-promisify';
import autobind from 'react-autobind';
import auth0helper from './auth0helper';

const LINK_ACCOUNTS = 'link-accounts';

class AuthProvider {
  constructor(clientId, domain, authStore, router, apiProvider) {
    autobind(this);
    this.lock = auth0helper.initLock(clientId, domain);
    this.lock.on('authenticated', this.afterAuthentication);
    this.lock.on('hide', this.hideHandler);
    this.auth0Sdk = auth0helper.initAuth0Sdk(clientId, domain);
    this.authStore = authStore;
    this.router = router;
    this.apiProvider = apiProvider;
    this.reportUserIdentityToSegment(this.authStore.profile);
    this.reLoadFullProfileCounter = 0;
    this.domain = domain;
  }

  hideHandler() {
    if (this.onHideCallback) {
      this.onHideCallback();
    }
    this.onHideCallback = undefined;
  }

  afterAuthentication(authResult) {
    const stateBeforeLogin = this.parseStateBeforeLogin(authResult);

    if (stateBeforeLogin && stateBeforeLogin.actionBeforeLogin === LINK_ACCOUNTS) {
      return auth0helper.linkAccount(this.domain, this.authStore.profile.auth0_user_id, this.authStore.idToken, authResult.idToken)
      // we are supposed to be in the link-account popup, so it can be closed
      .then(() => window.close());
    } else {
      this.authStore.setToken(authResult.idToken, authResult.accessToken);
      return this.getUserInfo(authResult)
        // wait until profile is set because our previous state might depend on it
        .then(() => this.recoverStateAfterLogin(stateBeforeLogin));
    }
  }

  parseStateBeforeLogin(authResult) {
    if (authResult.state) {
      try {
        return JSON.parse(authResult.state);
      } catch (ex) {
        window.console.error('error parsing state after login');
      }
    }
  }

  recoverStateAfterLogin(stateBeforeLogin) {
    if (stateBeforeLogin) {
      this.authStore.actionBeforeLogin = stateBeforeLogin.actionBeforeLogin;

      if (stateBeforeLogin.pathname) {
        this.router.setRoute(stateBeforeLogin.pathname + (stateBeforeLogin.search || ''));
      }
    }
  }

  getUserInfo() {
    const { accessToken } = this.authStore;
    return promisify(this.lock.getUserInfo, this.lock)(accessToken)
      .then(profile => this.reLoadFullProfile(profile))
      .catch(error => {
        window.console.log('Error loading the Profile', error);
        throw error;
      });
  }

  // Retry loading full user profile until we get dorbel_user_id which is updated async using auth0 rules.
  // Especially relevant for just signed up users.
  reLoadFullProfile(profile) {
    if (profile && profile.app_metadata && profile.app_metadata.dorbel_user_id) {
      this.setProfile(profile);
      this.reportSignup(profile);
    } else if (this.reLoadFullProfileCounter < 5) {
      window.setTimeout(() => this.getUserInfo(), 1000); // Try to get it again after 1 second.
      this.reLoadFullProfileCounter++;
    }
  }

  reportSignup(profile) {
    if (profile && profile.app_metadata.first_login) {
      window.analytics.track('client_user_signup', { user_id: profile.app_metadata.dorbel_user_id }); // For Facebook conversion tracking.
      profile.app_metadata.first_login = false;
      this.setProfile(profile);
    }
  }

  setProfile(profile) {
    let mappedProfile = auth0helper.mapAuth0Profile(profile);
    this.authStore.setProfile(mappedProfile);
    this.reportUserIdentityToSegment(mappedProfile);
  }

  shouldLogin(options) {
    if (!this.authStore.isLoggedIn) {
      this.showLoginModal(options);
      return true;
    }
    else { return false; }
  }

  showLoginModal(options = {}) {
    this.onHideCallback = options.onHideCallback;
    this.lock.show({
      auth: {
        params: {
          // this state is used in recoverStateAfterLogin
          state: JSON.stringify({
            pathname: window.location.pathname,
            search: window.location.search,
            actionBeforeLogin: options.actionBeforeLogin
          }),
          scope: 'openid'
        }
      }
    });
  }

  updateUserProfile(userProfile) {
    return this.apiProvider.fetch('/api/apartments/v1/user-profile/', { method: 'PATCH', data: userProfile })
      .then(this.setProfile);
  }

  logout() {
    this.authStore.logout();
  }

  reportUserIdentityToSegment(profile) {
    // https://segment.com/docs/sources/website/analytics.js/#identify
    // Need to identify user to Segemnt without updating its details.
    // All updates are done through server dorbel-shared updateUserDetails function.
    if (profile) {
      window.analytics.identify(profile.dorbel_user_id);
    }
  }

  linkSocialAccount(connection) {
    return new Promise(resolve => {
      this.auth0Sdk.popup.authorize({
        connection,
        responseType: 'token id_token',
        redirect_uri: window.location.origin + '/login',
        state: JSON.stringify({ actionBeforeLogin: LINK_ACCOUNTS }),
      }, err => {
        // This callback will be called a couple of times with random errors, don't panic !
        // The actual social login & linking will be done in a different window (popup) and is handled in this.afterAuthentication
        if (err.original === 'User closed the popup window') {
          // this will (also) happen on succesful linking, so we want to reload the user profile.
          resolve(this.getUserInfo());
        }
      });
    });
  }
}

module.exports = AuthProvider;
