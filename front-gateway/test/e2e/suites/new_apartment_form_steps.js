var home,
  newApartmentForm;

function login(browser) {
  home.navigate().signInAsTestUser();
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    newApartmentForm = browser.page.new_apartment_form();
  },
  // 'should go back from apartment details to previous screen': function (browser) {
  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .goFromApartmentDetailsApartmentPictures();

  //   browser.end();
  // },
  // 'should fill all apartment details fields as logged in user': function (browser) {
  //   login();

  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .fillApartmentDetailsAllFields()
  //     .goFromApartmentDetailsToOpenHouseEvent();

  //   browser.end();
  // },
  // 'should show validation errors when apartment details required fields not filled as logged in user': function (browser) {
  //   login();

  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .goFromApartmentDetailsToOpenHouseEventAndFail();

  //   browser.end();
  // },
  // 'should go back from event details to previous screen': function (browser) {
  //   newApartmentForm
  //     .navigateToOpenHouseEventSection()
  //     .goFromOpenHouseEventToApartmentDetails();

  //   browser.end();
  // },
  'should show validation errors when user details required fields not filled as logged in user': function (browser) {
    login();

    newApartmentForm
      .navigateToOpenHouseEventSection()
      .clearUserDetailsFields()
      .submitNewApartmentForm()
      .confirmSubmitSuccess()
      .confirmSubmitError();

    browser.end();
  },
  'should fill all event details fields as logged in user': function (browser) {
    login();

    newApartmentForm
      // TODO: Missing upload image functionality.
      .navigateToOpenHouseEventSection()
      .fillOpenHouseEventDetailsAllFields()
      .clearUserDetailsFields()
      .fillUserDetailsFields()
      .submitNewApartmentForm()
      .confirmSubmitSuccess();

    browser.end();
  }  
};
