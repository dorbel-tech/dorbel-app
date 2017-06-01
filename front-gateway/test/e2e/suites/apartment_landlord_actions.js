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
  'should go back from apartment pictures to previous screen if user doesnt sign in': function (browser) {
    apartmentForm
      .navigateToApartmentPicturesSection();
    home.dismissSingInForm();
    apartmentForm.expect.section('@apartmentDetails').to.be.visible;
    browser.end();
  },
  'should go back from apartment pictures to previous screen': function (browser) {
    apartmentForm
      .navigateToApartmentPicturesSection();
    home.fillSignIn(common.getTestUser('landlord'));
    browser.pause(2500);
    apartmentForm.goFromApartmentPicturesToApartmentDetails();
    apartmentForm.expect.section('@apartmentDetails').to.be.visible;
    browser.end();
  },
  'should fail to go to step3 no pictures were uploaded in step2': function (browser) {
    apartmentForm
      .navigateToApartmentPicturesSection();
    home.fillSignIn(common.getTestUser('landlord'));
    browser.pause(2500);
    apartmentForm.goFromApartmentPicturesToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.not.be.present;
    browser.end();
  },
  'should go back from event details to previous screen': function (browser) {
    apartmentForm
      .navigateToApartmentPicturesSection();
    home.fillSignIn(common.getTestUser('landlord'));
    browser.pause(2500);
    apartmentForm
      .uploadImage()
      .goFromApartmentPicturesToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.be.visible;
    apartmentForm
      .goFromOpenHouseEventToApartmentPictures()
      .expect.section('@apartmentPictures').to.be.visible;

    browser.end();
  },
  'should successfully submit a new apartment with logged in user': function (browser) {
    login();
    apartmentForm.navigateToApartmentPicturesSection()
      .uploadImage()
      .goFromApartmentPicturesToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.be.visible;

    apartmentForm
      .fillOpenHouseEventDetailsAllFields()
      .submitApartment();

    browser.pause(500);
    apartmentForm.expect.section('@successModal').to.be.present;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
    browser.end();
  },
  'should successfully submit a new apartment while creating new user': function (browser) {
    let user = common.getTestUser('random');

    apartmentForm.navigateToApartmentPicturesSection();
    home.signUpInForm(user);
    apartmentForm.uploadImage()
      .goFromApartmentPicturesToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.be.visible;

    apartmentForm
      .fillOpenHouseEventDetailsAllFields()
      .fillUserDetailsFields(user)
      .submitApartment();

    browser.pause(500);
    apartmentForm.expect.section('@successModal').to.be.present;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
    browser.end();
  }
};
