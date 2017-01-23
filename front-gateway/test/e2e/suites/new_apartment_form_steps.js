var home,
  newApartmentForm;

function login() {
  home.navigate().signInAsTestUser();
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
      .goFromApartmentDetailsApartmentPictures();

    browser.end();
  },
  'should go back from event details to previous screen': function (browser) {
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .goFromOpenHouseEventToApartmentDetails();

    browser.end();
  },  
  'should show validation errors when apartment details required fields not filled as logged in user': function (browser) {
    newApartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToOpenHouseEventAndFail();

    browser.end();
  },
  'should show validation errors when user details required fields not filled as logged in user': function (browser) {
    login();    

    newApartmentForm.navigateToOpenHouseEventSection();
    newApartmentForm
      .clearUserDetailsFields()
      .submitNewApartmentForm()
      .confirmSubmitError(); 

    browser.end();
  },
  'should fill all event details fields as logged in user': function (browser) {
    login();

    newApartmentForm
      // TODO: Still missing upload image functionality.
      .navigateToOpenHouseEventSection()
      .fillOpenHouseEventDetailsAllFields()
      .submitNewApartmentForm()
      .confirmSubmitSuccess();

    browser.end();
  }  
};
