'use strict';
const _ = require('lodash');
const localStorageHelper = require('../../stores/localStorageHelper');

function initLock(clientId, domain) {
  const Auth0Lock = require('auth0-lock').default; // can only be required on client side

  // Lock customization - https://auth0.com/docs/libraries/lock/v10/customization
  return new Auth0Lock(clientId, domain, {
    auth: {
      redirectUrl: window.location.origin + '/login',
      responseType: 'token'
    },
    allowAutocomplete: true,
    initialScreen: localStorageHelper.getItem('returning_user') ? undefined : 'signUp',
    theme: {
      logo: 'https://res.cloudinary.com/dorbel/image/upload/c_scale,h_58,w_58/v1477485453/dorbel_logo_2_1_uvvf3j.png',
      primaryColor: '#1cb039'
    },
    languageDictionary: { // https://github.com/auth0/lock/blob/master/src/i18n/en.js
      title: 'ברוכים הבאים',
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
      signUpTerms: ' בהרשמה אני מסכים/ה <a href="https://www.dorbel.com/pages/terms" target="_blank">לתנאי השימוש </a><a href="https://www.dorbel.com/pages/privacy_policy" target="_blank">ומדיניות הפרטיות</a>',
      signUp: {
        user_exists: 'כתובת מייל קיימת, לחצו על ״כניסה״ ונסו שנית',
      },
      login: {
        'lock.invalid_email_password': 'מייל זה לא קיים, לחצו על כפתור הרשמה והרשמו לאתר',
      },
      success: {
        forgotPassword: 'מייל לאיפוס ססמתך נשלח אלייך זה עתה',
      },
      lastLoginInstructions: 'לחצו על הכפתור כדי להתחבר שוב:',
      notYourAccountAction: 'לא החשבון שלכם?',
    }
  });
}

// Make sure to sync this object in case of changing with dorbe-shared server object as well:
// https://github.com/dorbel-tech/dorbel-shared/blob/master/src/utils/user/helpers.js#L6
function mapAuth0Profile(auth0profile) {
  const mappedProfile = {
    email: _.get(auth0profile, 'user_metadata.email') || auth0profile.email,
    first_name: _.get(auth0profile, 'user_metadata.first_name') || auth0profile.given_name,
    last_name: _.get(auth0profile, 'user_metadata.last_name') || auth0profile.family_name,
    phone: _.get(auth0profile, 'user_metadata.phone'),
    picture: getPermanentFBPictureUrl(auth0profile) || auth0profile.picture,
    tenant_profile: _.get(auth0profile, 'user_metadata.tenant_profile'),
    settings: _.get(auth0profile, 'user_metadata.settings') || {}
  };

  if (!mappedProfile.tenant_profile) {
    mappedProfile.tenant_profile = {};
    if (_.get(auth0profile, 'identities[0].provider') === 'facebook') {
      mappedProfile.tenant_profile.facebook_url = auth0profile.link;
    }
  }
  mappedProfile.role = _.get(auth0profile, 'app_metadata.role');
  mappedProfile.dorbel_user_id = _.get(auth0profile, 'app_metadata.dorbel_user_id');
  mappedProfile.first_login = _.get(auth0profile, 'app_metadata.first_login');

  return mappedProfile;
}

function getPermanentFBPictureUrl(user) {
  const facebookData = _.find(user.identities, (identity) => identity.provider === 'facebook');
  return facebookData ? `http://graph.facebook.com/${facebookData.user_id}/picture?type=large` : undefined;
}

module.exports = {
  initLock,
  mapAuth0Profile
};
