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
  'should fail to go to step3 no pictures were uploaded in step2': function (browser) {
    tryNavigatingToStep3WithoutPics(browser);
  },
  'should go back from contact details to previous screen': function (browser) {
    apartmentForm
      .navigateToApartmentPicturesSection();
    home.fillSignIn(common.getTestUser('landlord'));
    browser.pause(2500);
    apartmentForm
      .uploadImage()
      .goFromApartmentPicturesToContactDetails()
      .expect.section('@contactDetails').to.be.visible;
    apartmentForm
      .goFromContactDetailsToApartmentPictures()
      .expect.section('@apartmentPictures').to.be.visible;

    browser.end();
  },
  'should successfully submit a new apartment with logged in user': function (browser) {
    submitApartment(browser);
  },
  'should successfully submit a new apartment while creating new user': function (browser) {
    let user = common.getTestUser('random');
    apartmentForm.navigateToApartmentPicturesSection();
    home.signUpInForm(user);
    apartmentForm.uploadImage()
      .goFromApartmentPicturesToContactDetails()
      .expect.section('@contactDetails').to.be.visible;

    apartmentForm
      .fillUserDetailsFields(user)
      .submitApartment();

    browser.pause(500);
    apartmentForm.expect.section('@successModal').to.be.present;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
    browser.end();
  }
};

function submitApartment(browser) {
  login();

  apartmentForm.navigateToApartmentPicturesSection();
  apartmentForm.uploadImage();
  apartmentForm.goFromApartmentPicturesToContactDetails();
  apartmentForm.submitApartment();

  browser.pause(500);
  apartmentForm.expect.section('@successModal').to.be.present;
  common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');
  browser.end();
}

function tryNavigatingToStep3WithoutPics(browser) {
  apartmentForm.navigateToApartmentPicturesSection();
  home.fillSignIn(common.getTestUser('landlord'));
  browser.pause(2500);
  apartmentForm.goFromApartmentPicturesToContactDetails();

  apartmentForm.expect.section('@contactDetails').to.not.be.present;

  browser.end();
}
