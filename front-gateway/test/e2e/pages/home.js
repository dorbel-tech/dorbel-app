module.exports = {
  url: function(){
    return process.env.FRONT_GATEWAY_URL || 'http://localhost:3001';
  },
  elements: {
    loginLink:{
      selector: '.login-link'
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
    approve: {
      selector: 'button.auth0-lock-social-button.auth0-lock-social-big-button:first-of-type > div.auth0-lock-social-button-text'
    },
    addNewApartmentLink: {
      selector: 'a.add-apartment-button'
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
        .waitForElementVisible('body', 10000)
        .click('@loginLink')
        .waitForElementVisible('@emailField', 10000)
        .setValue('@emailField', 'e2e-user@dorbel.com')
        .setValue('@passwordField', 'JZ0PZ5NUcKlsez7lfQpN')
        .click('@submit')
        .waitForElementVisible('@approve', 10000)
        .click('@approve')
        .waitForElementNotPresent('@approve',10000);
    }
  }]
};
