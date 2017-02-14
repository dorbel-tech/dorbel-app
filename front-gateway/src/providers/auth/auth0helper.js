'use strict';

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
    }
  });
}

function mapAuth0Profile(auth0profile) {
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

module.exports = {
  initLock,
  mapAuth0Profile
};
