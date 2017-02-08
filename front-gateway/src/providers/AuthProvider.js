'use strict';
import promisify from 'es6-promisify';

class AuthProvider {
  constructor(clientId, domain, authStore, router) {
    const Auth0Lock = require('auth0-lock').default; // can only be required on client side
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: window.location.origin + '/login',
        responseType: 'token'
      },
      initialScreen: 'signUp',
      theme: {
        logo: 'https://res.cloudinary.com/dorbel/image/upload/c_scale,h_58,w_58/v1477485453/dorbel_logo_2_1_uvvf3j.png',
        primaryColor: '#31124b'
      },
      languageDictionary: {
        title: 'הרשמו לזיהוי קל בהמשך ולעדכונים חשובים בלבד',
        welcome: 'היי %s!',
        signUpWithLabel: '%s',
        signupTitle: 'הרשמה',
        signUpLabel: 'הרשמה',
        signUpSubmitLabel: 'הרשמה',
        loginLabel: 'כניסה',
        loginSubmitLabel: 'כניסה',
        loginWithLabel: '%s',
        databaseAlternativeSignUpInstructions: 'או',
        databaseEnterpriseAlternativeLoginInstructions: 'או',
        forgotPasswordAction: 'שכחתם סיסמא?',
        forgotPasswordInstructions: 'הכניסו את כתובת המייל שלכם. אנו נשלח אליכם מייל לאיפוס סיסמא.',
        forgotPasswordSubmitLabel: 'שלח',
        signUpTerms: ' אני מסכים/ה <a href="https://www.dorbel.com/pages/terms" target="_blank">לתנאי השימוש </a><a href="https://www.dorbel.com/pages/privacy_policy" target="_blank">ומדיניות הפרטיות</a>',
        signUp: {
          user_exists: 'כתובת מייל קיימת, לחצו על ״כניסה״ ונסו שנית',
        },
        login: {
          'lock.invalid_email_password': 'מייל זה לא קיים, לחצו על כפתור הרשמה והרשמו לאתר',
        },
        success: {
          forgotPassword: 'מייל לאיפוס ססמתך נשלח אלייך זה עתה',
        }
      },
      mustAcceptTerms: true
    });
    this.lock.on('authenticated', this.afterAuthentication.bind(this));
    this.authStore = authStore;
    this.router = router;
    this.showLoginModal = this.showLoginModal.bind(this);
    this.logout = this.logout.bind(this);
    this.reportIdentifyAnalytics(this.authStore.profile);
  }

  afterAuthentication(authResult) {
    this.authStore.setToken(authResult.idToken);
    this.getProfile(authResult)
    .then(() => { // wait until profile is set because our previous state might depend on it
      if (authResult.state) {
        this.recoverStateAfterLogin(authResult.state);
      }
    });
  }

  recoverStateAfterLogin(stateString) {
    try {
      const stateBeforeLogin = JSON.parse(stateString);
      if (stateBeforeLogin && stateBeforeLogin.pathname) {
        this.router.setRoute(stateBeforeLogin.pathname);
      }
    } catch(ex) {
      window.console.error('error parsing state after login');
    }
  }

  getProfile(authResult) {
    // DEPRECATION NOTICE: This method will be soon deprecated, use `getUserInfo` instead
    return promisify(this.lock.getProfile, this.lock)(authResult.idToken)
    .then(profile => {
      let mappedProfile = this.mapAuth0Profile(profile);
      this.authStore.setProfile(mappedProfile);
      this.reportIdentifyAnalytics(mappedProfile);
    })
    .catch(error => {
      window.console.log('Error loading the Profile', error);
      throw error;
    });
  }

  mapAuth0Profile(auth0profile) {
    const user_metadata = auth0profile.user_metadata || {};
    const app_metadata = auth0profile.app_metadata || {};

    return Object.assign({}, auth0profile, {
      first_name: user_metadata.first_name || auth0profile.given_name,
      last_name: user_metadata.last_name || auth0profile.family_name,
      email: user_metadata.email || auth0profile.email,
      phone: user_metadata.phone || auth0profile.phone,
      role: app_metadata.role || 'user'
    });
  }

  showLoginModal() {
    this.lock.show({
      auth: {
        params: {
          state: JSON.stringify({
            pathname: window.location.pathname
          })
        }
      }
    });
  }

  logout() {
    this.authStore.logout();
  }

  reportIdentifyAnalytics(profile) {
    // https://segment.com/docs/integrations/intercom/#identify
    if (profile) { window.analytics.identify(profile.dorbel_user_id, profile); }
  }
}

module.exports = AuthProvider;
