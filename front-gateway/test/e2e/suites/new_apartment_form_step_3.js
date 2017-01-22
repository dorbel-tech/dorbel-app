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
  'should go back from event details to previous screen': function (browser) {
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .goFromOpenHouseEventToApartmentDetails();

    browser.end();
  },
  'should fill all event details fields as logged in user': function (browser) {
    login();

    newApartmentForm
      .navigateToOpenHouseEventSection()
      .fillOpenHouseEventDetailsAllFields()
      .fillUserDetailsFields()
      .submitNewApartmentForm();

    browser.end();
  },
  'should fill all event details fields as anonymous user': function (browser) {
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .fillOpenHouseEventDetailsAllFields()
      .submitNewApartmentForm();

    browser.end();
  },
  'should fill event details required fields as logged in user': function (browser) {
    login();

    newApartmentForm
      .navigateToOpenHouseEventSection()
      .fillUserDetailsFields()
      .submitNewApartmentForm();

    browser.end();
  },
  'should fill event details required fields as anonymous user': function (browser) {
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .submitNewApartmentForm();

    browser.end();
  },
  'should show validation errors when event details required fields not filled as logged in user': function (browser) {
    login();

    newApartmentForm
      .navigateToOpenHouseEventSection()
      .submitNewApartmentForm();

    browser.end();
  },
  'should show validation errors when event details required fields not filled as anonymous user': function (browser) {
    newApartmentForm
      .navigateToOpenHouseEventSection()
      .submitNewApartmentForm();

    browser.end();
  }
};
