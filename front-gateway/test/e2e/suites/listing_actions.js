'use stric';
const common = require('../common');
let home, apartmentForm, listing, listingId;

function login(userType, browser) {
  home.navigate().signIn(userType, browser);
}

function logout() {
  home.signOut();
}

function submitApartment() {
  apartmentForm
    .fillAndSubmitApartment()
    .expect.section('@successModal').to.be.visible;
  common.waitForText(apartmentForm.section.successModal, '@successTitle', 'העלאת הדירה הושלמה!');
  // Get listingId from sucess modal dom element data-attr attribute.
  apartmentForm.section.successModal.getAttribute('@listingId', 'data-attr', function(result) {
    listingId = result.value;
  });
}

function waitForUnRegisterText() {
  common.waitForText(listing.section.oheList, '@firstEventText', 'הרשמו לביקור');
}

function waitForRegisterText() {
  common.waitForText(listing.section.oheList, '@firstEventText', 'נרשמתם לארוע זה. לחצו לביטול');
}

function waitForUnFollowText() {
  common.waitForText(listing.section.followContainer, '@followBtn', 'קבלו עדכונים על מועדים עתידיים');
}

function waitForFollowText() {
  common.waitForText(listing.section.followContainer, '@followBtn', 'לחצו להסרה מרשימת העדכונים');
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    apartmentForm = browser.page.apartment_form();
    listing = browser.page.listing();
  },
  'landlord should submit a new apartment': function (browser) {
    login('landlord', browser);
    submitApartment();
    browser.end();
  },
  'admin should approve apartment': function (browser) {
    login('admin', browser);
    listing.navigateToListingPage(listing.url(listingId));
    listing.expect.section('@landlordControls').to.be.visible;
    listing.changeListingStatus('listed');
    logout();
    browser.refresh();
    listing.expect.section('@listingTitle').to.be.visible;
    browser.end();
  },
  'tenant should register to OHE': function (browser) {
    login('tenant', browser);
    listing.navigateToListingPage(listing.url(listingId));
    waitForUnRegisterText();
    listing.clickFirstOhe();
    listing.expect.section('@oheModal').to.be.visible;
    listing.fillOheRegisterUserDetailsAndSubmit();
    waitForRegisterText();
    browser.end();
  },
  'tenant should unregister from OHE': function (browser) {
    login('tenant', browser);
    listing.navigateToListingPage(listing.url(listingId));
    waitForRegisterText();
    listing.clickFirstOhe();
    listing.expect.section('@oheModal').to.be.visible;
    listing.oheUnRegisterUser();
    browser.pause(300);
    waitForUnRegisterText();
    browser.end();
  },
  'tenant should follow to be notified for new OHE': function (browser) {
    login('tenant', browser);
    listing.navigateToListingPage(listing.url(listingId));
    waitForUnFollowText();
    listing.clickFollowOheButton();
    listing.expect.section('@followModal').to.be.visible;
    listing.followUserToOheUpdates();
    browser.pause(300);
    waitForFollowText();
    browser.end();
  },
  'tenant should unfollow to be notified of new OHE': function (browser) {
    login('tenant', browser);
    listing.navigateToListingPage(listing.url(listingId));
    waitForFollowText();
    listing.clickFollowOheButton();
    listing.expect.section('@followModal').to.be.visible;
    listing.unFollowUserToOheUpdates();
    browser.pause(300);
    waitForUnFollowText();
    browser.end();
  }
};
