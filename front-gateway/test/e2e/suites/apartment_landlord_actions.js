'use stric';
const common = require('../common');
let home, apartmentForm;

function login() {
  let user = common.getTestUser('landlord');
  home.navigate().signIn(user);
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    apartmentForm = browser.page.apartment_form();
  },
  'should go back from apartment details to previous screen': function (browser) {
    apartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToApartmentPictures()
      .expect.section('@apartmentPictures').to.be.visible;
    browser.end();
  },
  'should go back from event details to previous screen': function (browser) {
    apartmentForm
      .navigateToOpenHouseEventSection()
      .goFromOpenHouseEventToApartmentDetails()
      .expect.section('@apartmentDetails').to.be.visible;
    browser.end();
  },  
  'should fail to go to step3 as user details in step2 were not filled': function (browser) {
    apartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.not.be.present;
    browser.end();
  },
  'should fail to submit a new apartment because of missing user details': function (browser) {
    login();    
    apartmentForm
      .navigateToOpenHouseEventSection()
      .clearUserDetailsFields()
      .submitApartment();
    browser.pause(500);
    apartmentForm.expect.section('@successModal').to.not.be.present;
    browser.end();
  },
  'should successfully submit a new apartment with logged in user': function (browser) {
    login();
    apartmentForm.fillAndSubmitApartment();
    browser.pause(500);
    apartmentForm.expect.section('@successModal').to.be.present;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
    browser.end();
  },
  'should successfully submit a new apartment while creating new user': function (browser) {
    let user = common.getTestUser('random');
    apartmentForm
        .navigateToOpenHouseEventSection()
        .fillOpenHouseEventDetailsAllFields();
    home.signUpInForm(user);
    apartmentForm
      .fillUserDetailsFields(user)
      .submitApartment();
    browser.pause(500);
    apartmentForm.expect.section('@successModal').to.be.present;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
    browser.end();
  }    
};
