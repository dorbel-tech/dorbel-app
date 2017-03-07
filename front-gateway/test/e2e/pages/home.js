'use stric';
const common = require('../common');

module.exports = {
  url: function() {
    return common.getBaseUrl();
  },
  elements: {
    loginLink: {
      selector: '.header-navbar-profile-login-text'
    },
    logInText: {
      selector: '.header-navbar-profile-login-text a'
    },    
    loginTab: {
      selector: '.auth0-lock-tabs > li:nth-of-type(1) > a'
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
    submitLogin: {
      selector: '.upload-apt-left-container button.btn-success'
    }
  },
  commands: [{
    resizeDesktop: function(browser) {
      browser.resizeWindow(1280, 1024);
    },
    resizeMobile: function(browser) {
      browser.resizeWindow(320, 800);
    },
    fillSignIn: function(userType) {
      let user = common.getTestUser(userType);
      return this
        .waitForElementVisible('@loginTab')
        .click('@loginTab')
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit');
    },
    signIn: function(userType) {
      this
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .fillSignIn(userType)
        .waitForElementVisible('@logInText');
      common.waitForText(this, '@logInText', 'התנתק', 50000);
      return this;
    },
    signInForm: function(userType) {
      this
        .waitForElementVisible('@submitLogin')
        .click('@submitLogin')
        .fillSignIn(userType)
        .waitForElementVisible('@logInText');
      common.waitForText(this, '@logInText', 'התנתק', 50000);
      return this;
    },
    signOut: function () {
      this
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .waitForElementVisible('@logInText');
      common.waitForText(this, '@logInText', 'התחבר', 50000);
      return this;
    }
  }]
};
