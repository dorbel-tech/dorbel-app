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
    fillSignIn: function(user) {
      return this
        .waitForElementVisible('@loginTab')
        .click('@loginTab')
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit');
    },
    signUp: function(user) {
      this
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit')
        .validateSignIn();        
    },
    signIn: function(user) {
      this
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .fillSignIn(user)
        .validateSignIn();
      return this;
    },
    signUpInForm: function(user) {
      this
        .waitForElementVisible('@submitLogin')
        .click('@submitLogin');
      this.signUp(user);
      return this;
    },
    singInListing: function(user) {
      this
        .fillSignIn(user)
        .validateSignIn();
    },
    signOut: function () {
      this
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .waitForElementVisible('@logInText');
      common.waitForText(this, '@logInText', 'התחבר');
      return this;
    },
    validateSignIn: function() {
      this.waitForElementVisible('@logInText');
      common.waitForText(this, '@logInText', 'התנתק');      
    }
  }]
};
