const E2E_USER = {
  email: 'e2e-user@dorbel.com',
  password: 'JZ0PZ5NUcKlsez7lfQpN'
};
const E2E_USER_ADMIN = {
  email: 'e2e-user-admin@dorbel.com',
  password: '1Tz#N#7a#eeU'
};

module.exports = {
  url: function(){
    return process.env.FRONT_GATEWAY_URL || 'http://localhost:3001';
  },
  elements: {
    loginLink: {
      selector: '.header-navbar-profile-login-text'
    },
    loginTab: {
      selector: '.auth0-lock-tabs > li > a'
    },
    emailField: {
      selector: '.auth0-lock-input-email input[name=email]'
    },
    passwordField: {
      selector: '.auth0-lock-input-password input[name="password"]'
    },
    submit: {
      selector: 'button.auth0-lock-submit'
    },
    loggedInName: {
      selector: '.header-navbar-profile-text'
    }
  },
  commands: [{
    resizeDesktop: function(browser) {
      browser.resizeWindow(1280, 1024);
    },
    resizeMobile: function(browser) {
      browser.resizeWindow(320, 800);
    },    
    signInAsTestUser: function (isAdmin = false) {
      const user = isAdmin ? E2E_USER_ADMIN : E2E_USER;
      return this
        .waitForElementVisible('body')
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .waitForElementVisible('@loginTab')
        .click('@loginTab')        
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit')
        .waitForElementVisible('@loggedInName');
    }
  }]
};
