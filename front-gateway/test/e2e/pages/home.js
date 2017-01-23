module.exports = {

  url: function(){
    return process.env.FRONT_GATEWAY_URL || 'http://localhost:3001';
  },
  elements: {
    loginLink:{
      selector: '.header-navbar-profile-login-text'
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
      selector: '.header-navbar-profile-text a'
    }
  },
  commands: [{
    resizeDesktop: function(browser) {
      browser.resizeWindow(1280, 1024);
    },
    resizeMobile: function(browser) {
      browser.resizeWindow(320, 800);
    },    
    signInAsTestUser: function () {
      return this
        .waitForElementVisible('body')
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .waitForElementVisible('@emailField')
        .setValue('@emailField', 'e2e-user@dorbel.com')
        .setValue('@passwordField', 'JZ0PZ5NUcKlsez7lfQpN')
        .click('@submit')
        .waitForText('@loggedInName', (text) => ( text === 'Test' ));
    }
  }]
};
