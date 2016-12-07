module.exports = {
  beforeEach: function (browser) {
    return browser.page
      .home()
      .navigate()
      .signInAsTestUser();
  },
  'should add apartment': function (browser) {
    browser.page
      .new_apartment_form()
      .navigate()
      .waitForElementVisible('@addNewApartmentLink', 5000)
      .click('@addNewApartmentLink')
      .waitForElementVisible('@nextStepLink', 50000)
      .click('@nextStepLink');
      // .waitForElementVisible('i.fa.fa-arrow-circle-o-left.fa-2x', 1000)
      // .click('i.fa.fa-arrow-circle-o-left.fa-2x');

    //browser.end();
  }
};
