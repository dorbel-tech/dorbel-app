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
  common.waitForText(apartmentForm.section.successModal, '@successTitle', 'תהליך העלאת פרטי הדירה הושלם בהצלחה!');

  // Get listingId from success modal dom element data-attr attribute.
  apartmentForm.section.successModal.getAttribute('@listingId', 'data-attr', function (result) {
    listingId = result.value;
  });

  // Add first OHE
  apartmentForm.section.successModal.click('@okButton');
  browser.page.property()
    .addFirstOHE()
    .section.oheTab.expect.element('@futureOHECard').to.be.visible;

  browser.end();
}

function waitForUnRegisterText() {
  common.waitForText(listing.section.oheList, '@firstEventText', 'הרשם לביקור');
}

function waitForRegisterText() {
  common.waitForText(listing.section.oheList, '@firstEventText', 'בטל הרשמה');
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
  'admin should approve apartment': function (browser) {
    let property = browser.page.property();

    login('admin');
    property.navigateToPropertyPage(property.url(listingId));
    property.expect.section('@listingStatusSelector').to.be.visible;
    property.changeListingStatus('listed');
    browser.refresh();
    property.section.listingStatusSelector
      .expect.element('@listingMenuStatusDropdownToggle').text.to.equal('מפורסמת');
    logout();
    browser.end();
  },
  'tenant should like apartment': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    common.waitForText(listing.section.like, '@text', 'אהבתי');
    listing.clickLikeButton();
    listing.validateSuccessNotificationVisible();
    common.waitForText(listing, '@notification', 'הדירה נשמרה בהצלחה לרשימת הדירות שאהבתם');
    browser.end();
  },
  'tenant should unlike apartment': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    common.waitForText(listing.section.like, '@text', 'אהבתי');
    listing.clickLikeButton();
    listing.validateSuccessNotificationVisible();
    common.waitForText(listing, '@notification', 'הדירה הוסרה בהצלחה מרשימת ההירות שאהבתם');
    browser.end();
  },
  'tenant should register to OHE': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    waitForUnRegisterText();
    listing.clickFirstOhe();
    listing.expect.section('@oheModal').to.be.visible;
    listing.fillOheRegisterUserDetailsAndSubmit();
    waitForRegisterText();
    browser.end();
  },
  'tenant should unregister from OHE': function (browser) {
    login('tenant');
    listing.navigateToListingPage(listing.url(listingId));
    waitForRegisterText();
    listing.clickFirstOhe();
    listing.expect.section('@oheModal').to.be.visible;
    listing.oheUnRegisterUser();
    browser.pause(500);
    waitForUnRegisterText();
    browser.end();
  },
  'tenant should register to OHE while triggering login': function (browser) {
    listing.navigateToListingPage(listing.url(listingId));
    waitForUnRegisterText();
    listing.clickFirstOhe();
    loginInListing('tenant');
    listing.expect.section('@oheModal').to.be.visible;
    listing.fillOheRegisterUserDetailsAndSubmit();
    waitForRegisterText();
    browser.end();
  }
};
