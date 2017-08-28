'use strict';
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
    apartmentForm.props.mode = 'publish';
  },
  'should not display exitDate input on upload for publish': function () {
    apartmentForm.navigateToApartmentDetailsSection()
      .section.apartmentDetails.assert.elementNotPresent('@exitDate');
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
  'should fail to go to step3 no pictures were uploaded in step2 (uploadMode = publish)': function (browser) {
    tryNavigatingToStep3WithoutPics(browser);
  },
  'should proceed to step3 when no pictures were uploaded in step2 (uploadMode = manage)': function (browser) {
    tryNavigatingToStep3WithoutPics(browser, 'manage');
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
    submitApartment(browser);
  },
  'should successfully submit a new apartment for management with logged in user': function (browser) {
    submitApartment(browser, 'manage');
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

function submitApartment(browser, uploadMode = 'publish') {
  apartmentForm.props.mode = uploadMode;
  login();

  apartmentForm.navigateToApartmentPicturesSection();

  // Don't upload image in manage mode to get image thumbnail instead.
  if (uploadMode === 'publish') {
    apartmentForm.uploadImage();
  }

  apartmentForm.goFromApartmentPicturesToOpenHouseEvent();

  if (apartmentForm.props.mode == 'publish') {
    apartmentForm.expect.section('@openHouseEvent').to.be.visible;
    apartmentForm.fillOpenHouseEventDetailsAllFields();
  }

  apartmentForm.submitApartment();

  browser.pause(500);
  apartmentForm.expect.section('@successModal').to.be.present;
  common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
  browser.end();
}

function tryNavigatingToStep3WithoutPics(browser, uploadMode = 'publish') {
  apartmentForm.props.mode = uploadMode;
  apartmentForm
    .navigateToApartmentPicturesSection();
  home.fillSignIn(common.getTestUser('landlord'));
  browser.pause(2500);
  apartmentForm.goFromApartmentPicturesToOpenHouseEvent();

  uploadMode == 'publish' ?
    apartmentForm.expect.section('@openHouseEvent').to.not.be.present :
    apartmentForm.expect.section('@openHouseEvent').to.be.present;

  browser.end();
}
