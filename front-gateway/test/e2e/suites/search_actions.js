'use stric';
const common = require('../common');
let home, search;

function login(userType) {
  let user = common.getTestUser(userType);
  home.navigate()
    .waitForElementVisible('body')
    .signIn(user);
}

function logout() {
  home.signOut();
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    search = browser.page.search();
  },
  'guest user should see no admin listing status controls': function (browser) {
    search
      .navigate()
      .selectMoreFilters()
      .section.body.assert.elementNotPresent('@listingStatus');
    browser.end();
  },
  'landlord should see no admin listing status controls': function (browser) {
    login('landlord');
    search
      .navigate()
      .selectMoreFilters()
      .section.body.assert.elementNotPresent('@listingStatus');
    logout();
    browser.end();
  },
  'admin should see admin listing status controls': function (browser) {
    login('admin');
    search
      .navigate()
      .selectMoreFilters()
      .section.body.assert.elementPresent('@listingStatus');
    logout();
    browser.end();
  }
};
