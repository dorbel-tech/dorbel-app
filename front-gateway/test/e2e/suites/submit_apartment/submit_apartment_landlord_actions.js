var home,
  newApartmentForm;

function login() {
  home.navigate().signInAsTestUser(false);
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    newApartmentForm = browser.page.new_apartment_form();
  },
  'should go back from apartment details to previous screen': function (browser) {
    newApartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToApartmentPictures()
      .expect.section('@apartmentPictures').to.be.visible;
    browser.end();
  },
  'should go back from event details to previous screen': function (browser) {
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .goFromOpenHouseEventToApartmentDetails()
      .expect.section('@apartmentDetails').to.be.visible;
    browser.end();
  },  
  'should fail to go to step3 as user details in step2 were not filled': function (browser) {
    newApartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.not.be.present;
    browser.end();
  },
  'should fail to submit a new apartment because of mising user details': function (browser) {
    login();    
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .clearUserDetailsFields()
      .submitNewApartmentForm()
      .expect.section('@successModal').to.not.be.present;
    browser.end();
  },
  'should successfully submit a new apartment': function (browser) {
    login();
    newApartmentForm
      .fillAndSubmitNewApartmentForm()
      .expect.section('@successModal').to.be.visible;
    newApartmentForm
      .section.successModal.waitForText('@successTitle', (text) => ( text === 'העלאת הדירה הושלמה!' ));
    browser.end();
  }  
};
