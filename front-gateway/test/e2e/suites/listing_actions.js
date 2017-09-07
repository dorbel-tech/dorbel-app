'use stric';
const common = require('../common');
let home, apartmentForm, listing, listingId;

function login(userType) {
  let user = common.getTestUser(userType);
  home.navigate()
    .waitForElementVisible('body')
    .signIn(user);
}

function loginInListing(userType) {
  let user = common.getTestUser(userType);
  home.singInListing(user);
}

function logout() {
  home.signOut();
}

function submitApartment(browser) {
  apartmentForm
    .navigateToApartmentPicturesSection()
    .uploadImage()
    .goFromApartmentPicturesToContactDetails()
    .submitApartment();

  browser.pause(500);
  apartmentForm.expect.section('@successModal').to.be.present;
  common.waitForText(apartmentForm.section.successModal, '@successTitle', 'פרטי הדירה שלכם עלו בהצלחה!');

  // Get listingId from success modal dom element data-attr attribute.
  apartmentForm.section.successModal.getAttribute('@listingId', 'data-attr', function (result) {
    listingId = result.value;
  });
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    apartmentForm = browser.page.apartment_form();
    listing = browser.page.listing();
  },
  'landlord should submit a new apartment': function (browser) {
    login('landlord');
    submitApartment(browser);
    browser.end();
  },
  'tenant should take interest in apartment': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    common.waitForText(listing.section.like, '@text', 'אני מעוניין/ת בדירה');
    listing.clickLikeButton();

    //browser.pause(500);
    //listing.expect.section('@profileEditModal').to.be.present;
    //common.waitForText(listing.section.profileEditModal, '@title', 'עזרו לבעל הדירה להכיר אתכם - פרטים בסיסיים');
    //listing.fillAndSubmitProfile();

    //listing.validateSuccessNotificationVisible();
    //common.waitForText(listing, '@notification', 'הדירה נשמרה בהצלחה לרשימת הדירות שאתם מעוניינים');
    browser.end();
  },
  'tenant should be notified when taking interest in an already interesting apartment': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    common.waitForText(listing.section.like, '@text', 'אני מעוניין/ת בדירה');
    listing.clickLikeButton();
    listing.validateSuccessNotificationVisible();
    common.waitForText(listing, '@notification', 'כבר יצרתם קשר עם בעל דירה זה');
    browser.end();
  }
};
