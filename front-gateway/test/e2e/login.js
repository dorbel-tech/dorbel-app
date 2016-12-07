module.exports = {
  'Login' : function (browser) {
    browser
      .url('http://localhost:3001')
      .waitForElementVisible('body', 1000)
      .click('a[data-reactid="26"]')
      .pause(3000)
      //.click('button.auth0-lock-social-button')
      .setValue('.auth0-lock-input-email > input[name=email]', 'e2e-user@dorbel.com')
      .setValue('.auth0-lock-input-password > input[name=password]', 'JZ0PZ5NUcKlsez7lfQpN')
      // .click('.auth0-lock-submit')
      // .pause(1000)
      // .assert.containsText('.app-content-with-header', 'Already logged in')
      // .end();
  }
};


