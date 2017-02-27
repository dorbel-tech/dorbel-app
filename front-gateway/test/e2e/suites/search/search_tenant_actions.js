var helper,
  newApartmentForm;

function login() {
  helper.navigate().signInAsTestUser(true);
}

module.exports = {
  beforeEach: function (browser) {
    helper = browser.page.helper();
    helper.resizeDesktop(browser);
    newApartmentForm = browser.page.new_apartment_form();
  },

  
};
