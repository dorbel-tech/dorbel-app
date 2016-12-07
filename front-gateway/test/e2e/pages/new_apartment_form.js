module.exports = {
  url: 'http://localhost:3001',
  elements: {
    addNewApartmentLink:{
      selector: 'a.add-apartment-button'
    },
    nextStepLink:{
      selector: 'i.new-aparatment-next-step-button'
    }
  }
  // commands: [{
  //   signInAsTestUser: function () {
  //     return this
  //       .waitForElementVisible('body', 1000)
  //       .click('@loginLink')
  //       .waitForElementVisible('@emailField', 5000)
  //       .setValue('@emailField', 'e2e-user@dorbel.com')
  //       .setValue('@passwordField', 'JZ0PZ5NUcKlsez7lfQpN')
  //       .click('@submit')
  //       .waitForElementVisible('@approve', 5000)
  //       .click('@approve')
  //       .waitForElementNotPresent('@approve',1000);
  //   }
  // }]
};


