var home,
  newApartmentForm;

function login(browser) {
  home.navigate().signInAsTestUser();
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
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
  // 'should fill all apartment details fields as anonymous user': function (browser) {
  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .fillApartmentDetailsAllFields()
  //     .goFromApartmentDetailsToOpenHouseEvent();

  //   browser.end();
  // },
  // 'should fill apartment details required fields as logged in user': function (browser) {
  //   login();

  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .fillApartmentDetailsRequiredFields()
  //     .goFromApartmentDetailsToOpenHouseEvent();

  //   browser.end();
  // },
  // 'should fill apartment details required fields as anonymous user': function (browser) {
  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .fillApartmentDetailsRequiredFields()
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
  // 'should show validation errors when apartment details required fields not filled as anonymous user': function (browser) {
  //   newApartmentForm
  //     .navigateToApartmentDetailsSection()
  //     .goFromApartmentDetailsToOpenHouseEventAndFail();

  //   browser.end();
  // },
  // 'should go back from open house event to previous screen': function (browser) {
  //   newApartmentForm
  //     .navigateToOpenHouseEventSection()
  //     .goFromOpenHouseEventToApartmentDetails();

  //   browser.end();
  // }
};
