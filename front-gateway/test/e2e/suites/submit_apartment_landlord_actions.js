'use stric';
const common = require('../common');
let home, submitApartmentForm;

function login() {
  home.navigate().signIn('landlord');
}

function loginOnStep3() {
  home.signInForm('landlord');
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    submitApartmentForm = browser.page.submit_apartment_form();
  },
  // 'should go back from apartment details to previous screen': function (browser) {
  //   submitApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .goFromApartmentDetailsToApartmentPictures()
  //     .expect.section('@apartmentPictures').to.be.visible;
  //   browser.end();
  // },
  // 'should go back from event details to previous screen': function (browser) {
  //   submitApartmentForm
  //     .navigateToOpenHouseEventSection()
  //     .goFromOpenHouseEventToApartmentDetails()
  //     .expect.section('@apartmentDetails').to.be.visible;
  //   browser.end();
  // },  
  // 'should fail to go to step3 as user details in step2 were not filled': function (browser) {
  //   submitApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .goFromApartmentDetailsToOpenHouseEvent()
  //     .expect.section('@openHouseEvent').to.not.be.present;
  //   browser.end();
  // },
  // 'should fail to submit a new apartment because of mising user details': function (browser) {
  //   login();    
  //   submitApartmentForm
  //     .navigateToOpenHouseEventSection()
  //     .clearUserDetailsFields()
  //     .submitsubmitApartmentForm()
  //     .expect.section('@successModal').to.not.be.present;
  //   browser.end();
  // },
  'should successfully submit a new apartment with logged in user': function (browser) {
    login();
    submitApartmentForm
      .fillAndSubmitsubmitApartmentForm()
      .expect.section('@successModal').to.be.visible;
    common.waitForText(submitApartmentForm.section.successModal, '@successTitle', 'העלאת הדירה הושלמה!' );
    browser.end();
  },
  'should successfully submit a new apartment with logged out user': function (browser) {
    submitApartmentForm
        .navigateToOpenHouseEventSection()
        .fillOpenHouseEventDetailsAllFields();
    loginOnStep3();
    submitApartmentForm
      .submitsubmitApartmentForm()
      .expect.section('@successModal').to.be.visible;
    common.waitForText(submitApartmentForm.section.successModal, '@successTitle', 'העלאת הדירה הושלמה!' );
    browser.end();
  }    
};
