'use strict';
const _ = require('lodash');

function initLock(clientId, domain) {
  const Auth0Lock = require('auth0-lock').default; // can only be required on client side
  return new Auth0Lock(clientId, domain, {
    auth: {
      redirectUrl: window.location.origin + '/login',
      responseType: 'token'
    },
    initialScreen: 'signUp',
    theme: {
      logo: 'https://res.cloudinary.com/dorbel/image/upload/c_scale,h_58,w_58/v1477485453/dorbel_logo_2_1_uvvf3j.png',
      primaryColor: '#1cb039'
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
    }
  });
}

function mapAuth0Profile(auth0profile) {
  const mappedProfile = {
    email: _.get(auth0profile, 'user_metadata.email') || auth0profile.email,
    first_name: _.get(auth0profile, 'user_metadata.first_name') || auth0profile.given_name,
    last_name: _.get(auth0profile, 'user_metadata.last_name') || auth0profile.family_name,
    phone: _.get(auth0profile, 'user_metadata.phone'),
    picture: auth0profile.picture,
    tenant_profile: _.get(auth0profile, 'user_metadata.tenant_profile')
  };

  if (!mappedProfile.tenant_profile) {
    mappedProfile.tenant_profile = {};
    if (_.get(auth0profile, 'identities[0].provider') === 'facebook') {
      mappedProfile.tenant_profile.facebook_url = auth0profile.link;
    }
  }
  mappedProfile.role = _.get(auth0profile, 'app_metadata.role');

  return mappedProfile;
}

module.exports = {
  initLock,
  mapAuth0Profile
};
