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
    }
  },
  commands: [{
    resizeDesktop: function(browser) {
      browser.resizeWindow(1280, 1024);
    },
    resizeMobile: function(browser) {
      browser.resizeWindow(320, 800);
    },
    signInAsTestUser: function (userType) {      
      let user = common.getTestUser(userType);
      this
        .waitForElementVisible('body')
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .waitForElementVisible('@loginTab')
        .click('@loginTab')
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit');
      common.waitForText(this, '@logInText', 'התנתק');
      return this;
        
    },
    signOut: function () {
      return this
        .waitForElementVisible('body')
        .waitForElementVisible('@loginLink')
        .click('@loginLink');        
    }
  }]
};
